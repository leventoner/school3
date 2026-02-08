use axum::{
    extract::{State, Path},
    Json,
    http::StatusCode,
    response::IntoResponse,
};
use crate::db::DbPool;
use crate::models::Teacher;
use crate::handlers::students::CurrentUser;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct TeacherInput {
    #[serde(rename = "firstName")]
    pub first_name: String,
    #[serde(rename = "lastName")]
    pub last_name: String,
    pub email: String,
    pub phone: String,
    pub specialization: String,
}

pub async fn get_all_teachers(
    State(pool): State<DbPool>,
    _user: CurrentUser,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let teachers = sqlx::query_as::<_, Teacher>("SELECT * FROM teachers")
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(teachers))
}

pub async fn get_teacher(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let teacher = sqlx::query_as::<_, Teacher>("SELECT * FROM teachers WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
        .ok_or((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Teacher not found"}))))?;

    Ok(Json(teacher))
}

pub async fn create_teacher(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Json(payload): Json<TeacherInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "INSERT INTO teachers (first_name, last_name, email, phone, specialization) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&payload.first_name)
    .bind(&payload.last_name)
    .bind(&payload.email)
    .bind(&payload.phone)
    .bind(&payload.specialization)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let teacher_id = result.last_insert_id() as i32;

    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": teacher_id,
        "firstName": payload.first_name,
        "lastName": payload.last_name,
        "email": payload.email,
        "phone": payload.phone,
        "specialization": payload.specialization
    }))))
}

pub async fn update_teacher(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
    Json(payload): Json<TeacherInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "UPDATE teachers SET first_name = ?, last_name = ?, email = ?, phone = ?, specialization = ? WHERE id = ?"
    )
    .bind(&payload.first_name)
    .bind(&payload.last_name)
    .bind(&payload.email)
    .bind(&payload.phone)
    .bind(&payload.specialization)
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Teacher not found"}))));
    }

    Ok(Json(serde_json::json!({
        "id": id,
        "firstName": payload.first_name,
        "lastName": payload.last_name,
        "email": payload.email,
        "phone": payload.phone,
        "specialization": payload.specialization
    })))
}

pub async fn delete_teacher(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query("DELETE FROM teachers WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Teacher not found"}))));
    }

    Ok(StatusCode::NO_CONTENT)
}
