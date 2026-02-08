use axum::{
    extract::{State, Path},
    Json,
    http::StatusCode,
    response::IntoResponse,
};
use crate::db::DbPool;
use crate::models::Book;
use crate::handlers::students::CurrentUser;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct BookInput {
    pub title: String,
    pub author: String,
    pub isbn: String,
    pub category: String,
    pub status: String,
}

pub async fn get_all_books(
    State(pool): State<DbPool>,
    _user: CurrentUser,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let books = sqlx::query_as::<_, Book>("SELECT * FROM books")
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(books))
}

pub async fn get_book(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let book = sqlx::query_as::<_, Book>("SELECT * FROM books WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
        .ok_or((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Book not found"}))))?;

    Ok(Json(book))
}

pub async fn create_book(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Json(payload): Json<BookInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "INSERT INTO books (title, author, isbn, category, status) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&payload.title)
    .bind(&payload.author)
    .bind(&payload.isbn)
    .bind(&payload.category)
    .bind(&payload.status)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let book_id = result.last_insert_id() as i32;

    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": book_id,
        "title": payload.title,
        "author": payload.author,
        "isbn": payload.isbn,
        "category": payload.category,
        "status": payload.status
    }))))
}

pub async fn update_book(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
    Json(payload): Json<BookInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query(
        "UPDATE books SET title = ?, author = ?, isbn = ?, category = ?, status = ? WHERE id = ?"
    )
    .bind(&payload.title)
    .bind(&payload.author)
    .bind(&payload.isbn)
    .bind(&payload.category)
    .bind(&payload.status)
    .bind(id)
    .execute(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Book not found"}))));
    }

    Ok(Json(serde_json::json!({
        "id": id,
        "title": payload.title,
        "author": payload.author,
        "isbn": payload.isbn,
        "category": payload.category,
        "status": payload.status
    })))
}

pub async fn delete_book(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query("DELETE FROM books WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Book not found"}))));
    }

    Ok(StatusCode::NO_CONTENT)
}
