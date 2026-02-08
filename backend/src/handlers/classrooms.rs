use axum::{
    extract::{State, Path},
    Json,
    http::StatusCode,
    response::IntoResponse,
};
use crate::db::DbPool;
use crate::models::Classroom;
use crate::handlers::students::CurrentUser;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct ClassroomInput {
    #[serde(rename = "roomNumber")]
    pub room_number: String,
    pub capacity: i32,
    #[serde(rename = "roomType")]
    pub room_type: String,
    pub floor: i32,
}

pub async fn get_all_classrooms(
    State(pool): State<DbPool>,
    _user: CurrentUser,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let classrooms = sqlx::query_as::<_, Classroom>("SELECT * FROM classrooms")
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(classrooms))
}

pub async fn get_classroom(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let classroom = sqlx::query_as::<_, Classroom>("SELECT * FROM classrooms WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
        .ok_or((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Classroom not found"}))))?;

    Ok(Json(classroom))
}

pub async fn create_classroom(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Json(payload): Json<ClassroomInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "INSERT INTO classrooms (room_number, capacity, room_type, floor) VALUES (?, ?, ?, ?)"
    )
    .bind(&payload.room_number)
    .bind(payload.capacity)
    .bind(&payload.room_type)
    .bind(payload.floor)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let classroom_id = result.last_insert_id() as i32;

    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": classroom_id,
        "roomNumber": payload.room_number,
        "capacity": payload.capacity,
        "roomType": payload.room_type,
        "floor": payload.floor
    }))))
}

pub async fn update_classroom(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
    Json(payload): Json<ClassroomInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "UPDATE classrooms SET room_number = ?, capacity = ?, room_type = ?, floor = ? WHERE id = ?"
    )
    .bind(&payload.room_number)
    .bind(payload.capacity)
    .bind(&payload.room_type)
    .bind(payload.floor)
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Classroom not found"}))));
    }

    Ok(Json(serde_json::json!({
        "id": id,
        "roomNumber": payload.room_number,
        "capacity": payload.capacity,
        "roomType": payload.room_type,
        "floor": payload.floor
    })))
}

pub async fn delete_classroom(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query("DELETE FROM classrooms WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Classroom not found"}))));
    }

    Ok(StatusCode::NO_CONTENT)
}
