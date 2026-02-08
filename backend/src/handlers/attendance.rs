use axum::{
    extract::{State, Path},
    Json,
    http::StatusCode,
    response::IntoResponse,
};
use crate::db::DbPool;
use crate::models::Attendance;
use crate::handlers::students::CurrentUser;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AttendanceInput {
    #[serde(rename = "studentId")]
    pub student_id: i32,
    pub date: String,
    pub status: String,
}

pub async fn get_all_attendance(
    State(pool): State<DbPool>,
    _user: CurrentUser,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let attendance = sqlx::query_as::<_, Attendance>("SELECT * FROM attendance")
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(attendance))
}

pub async fn get_student_attendance(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(student_id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let attendance = sqlx::query_as::<_, Attendance>("SELECT * FROM attendance WHERE student_id = ?")
        .bind(student_id)
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(attendance))
}

pub async fn create_attendance(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Json(payload): Json<AttendanceInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)"
    )
    .bind(payload.student_id)
    .bind(&payload.date)
    .bind(&payload.status)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let id = result.last_insert_id() as i32;

    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": id,
        "studentId": payload.student_id,
        "date": payload.date,
        "status": payload.status
    }))))
}

pub async fn delete_attendance(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query("DELETE FROM attendance WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Attendance record not found"}))));
    }

    Ok(StatusCode::NO_CONTENT)
}
