use axum::{
    extract::{State, Path},
    Json,
    http::StatusCode,
    response::IntoResponse,
};
use crate::db::DbPool;
use crate::models::Grade;
use crate::handlers::students::CurrentUser;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct GradeInput {
    #[serde(rename = "studentId")]
    pub student_id: i32,
    pub subject: String,
    pub score: f64,
    #[serde(rename = "examDate")]
    pub exam_date: String,
}

pub async fn get_all_grades(
    State(pool): State<DbPool>,
    _user: CurrentUser,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let grades = sqlx::query_as::<_, Grade>("SELECT * FROM grades")
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(grades))
}

pub async fn get_student_grades(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(student_id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let grades = sqlx::query_as::<_, Grade>("SELECT * FROM grades WHERE student_id = ?")
        .bind(student_id)
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(grades))
}

pub async fn create_grade(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Json(payload): Json<GradeInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "INSERT INTO grades (student_id, subject, score, exam_date) VALUES (?, ?, ?, ?)"
    )
    .bind(payload.student_id)
    .bind(&payload.subject)
    .bind(payload.score)
    .bind(&payload.exam_date)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let id = result.last_insert_id() as i32;

    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": id,
        "studentId": payload.student_id,
        "subject": payload.subject,
        "score": payload.score,
        "examDate": payload.exam_date
    }))))
}

pub async fn update_grade(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
    Json(payload): Json<GradeInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "UPDATE grades SET subject = ?, score = ?, exam_date = ? WHERE id = ?"
    )
    .bind(&payload.subject)
    .bind(payload.score)
    .bind(&payload.exam_date)
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Grade record not found"}))));
    }

    Ok(Json(serde_json::json!({
        "id": id,
        "studentId": payload.student_id,
        "subject": payload.subject,
        "score": payload.score,
        "examDate": payload.exam_date
    })))
}

pub async fn delete_grade(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query("DELETE FROM grades WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Grade record not found"}))));
    }

    Ok(StatusCode::NO_CONTENT)
}
