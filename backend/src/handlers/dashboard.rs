use axum::{
    extract::State,
    Json,
    http::StatusCode,
    response::IntoResponse,
};
use crate::db::DbPool;
use serde::Serialize;
use sqlx::Row;

#[derive(Debug, Serialize)]
pub struct DashboardStats {
    pub total_students: i64,
    pub total_teachers: i64,
    pub total_classrooms: i64,
    pub total_books: i64,
}

pub async fn get_dashboard_stats(
    State(pool): State<DbPool>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let total_students: i64 = sqlx::query("SELECT COUNT(*) FROM students")
        .fetch_one(&pool)
        .await
        .map(|row| row.get(0))
        .unwrap_or(0);

    let total_teachers: i64 = sqlx::query("SELECT COUNT(*) FROM teachers")
        .fetch_one(&pool)
        .await
        .map(|row| row.get(0))
        .unwrap_or(0);
    
    let total_classrooms: i64 = sqlx::query("SELECT COUNT(*) FROM classrooms")
        .fetch_one(&pool)
        .await
        .map(|row| row.get(0))
        .unwrap_or(0);

    let total_books: i64 = sqlx::query("SELECT COUNT(*) FROM books")
        .fetch_one(&pool)
        .await
        .map(|row| row.get(0))
        .unwrap_or(0);

    let stats = DashboardStats {
        total_students,
        total_teachers,
        total_classrooms,
        total_books,
    };

    Ok(Json(stats))
}
