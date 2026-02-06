use axum::{
    extract::{State, Path},
    Json,
    http::{StatusCode, HeaderMap},
    response::IntoResponse,
    async_trait,
    extract::{FromRequestParts, FromRef},
};
use axum::http::request::Parts;
use crate::db::DbPool;
use crate::models::{Student, StudentCourse, StudentWithCourses, User};
use crate::auth::{Claims, SECRET_KEY};
use jsonwebtoken::{decode, DecodingKey, Validation};
use std::collections::HashMap;
use serde::{Deserialize, Serialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct StudentInput {
    #[serde(rename = "firstName")]
    pub first_name: String,
    #[serde(rename = "lastName")]
    pub last_name: String,
    #[serde(rename = "schoolNumber")]
    pub school_number: String,
    #[serde(rename = "birthDate")]
    pub birth_date: String,
    #[serde(rename = "studentClass")]
    pub student_class: String,
    pub courses: HashMap<String, String>,
}

pub struct CurrentUser(pub User);

#[async_trait]
impl<S> FromRequestParts<S> for CurrentUser
where
    S: Send + Sync,
    DbPool: axum::extract::FromRef<S>,
{
    type Rejection = (StatusCode, Json<serde_json::Value>);

    async fn from_request_parts(parts: &mut Parts, state: &S) -> Result<Self, Self::Rejection> {
        let pool = DbPool::from_ref(state);
        let headers = HeaderMap::from_request_parts(parts, state).await.map_err(|_| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "Invalid headers"}))))?;
        
        let auth_header = headers.get("Authorization")
            .and_then(|h| h.to_str().ok())
            .ok_or((StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "Missing authorization header"}))))?;

        if !auth_header.starts_with("Bearer ") {
            return Err((StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "Invalid token type"}))));
        }

        let token = &auth_header[7..];
        let token_data = decode::<Claims>(
            token,
            &DecodingKey::from_secret(SECRET_KEY),
            &Validation::default(),
        ).map_err(|_| (StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "Invalid token"}))))?;

        let user = sqlx::query_as::<sqlx::MySql, User>("SELECT * FROM users WHERE username = ?")
            .bind(&token_data.claims.sub)
            .fetch_optional(&pool)
            .await
            .map_err(|e: sqlx::Error| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
            .ok_or((StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "User not found"}))))?;

        Ok(CurrentUser(user))
    }
}

pub async fn get_all_students(
    State(pool): State<DbPool>,
    _user: CurrentUser,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let students = sqlx::query_as::<_, Student>("SELECT * FROM students")
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let mut result = Vec::new();
    for student in students {
        let courses = sqlx::query_as::<_, StudentCourse>("SELECT * FROM student_courses WHERE student_id = ?")
            .bind(student.id)
            .fetch_all(&pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;
        
        // Convert to a map to match the frontend expects
        let course_map: HashMap<String, Option<String>> = courses.into_iter().map(|c| (c.course, c.grade)).collect();
        
        result.push(serde_json::json!({
            "id": student.id,
            "firstName": student.first_name,
            "lastName": student.last_name,
            "schoolNumber": student.school_number,
            "birthDate": student.birth_date,
            "studentClass": student.student_class,
            "courses": course_map
        }));
    }

    Ok(Json(result))
}

pub async fn get_student(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let student = sqlx::query_as::<_, Student>("SELECT * FROM students WHERE id = ?")
        .bind(id)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
        .ok_or((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Student not found"}))))?;

    let courses = sqlx::query_as::<_, StudentCourse>("SELECT * FROM student_courses WHERE student_id = ?")
        .bind(student.id)
        .fetch_all(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;
    
    let course_map: HashMap<String, Option<String>> = courses.into_iter().map(|c| (c.course, c.grade)).collect();

    Ok(Json(serde_json::json!({
        "id": student.id,
        "firstName": student.first_name,
        "lastName": student.last_name,
        "schoolNumber": student.school_number,
        "birthDate": student.birth_date,
        "studentClass": student.student_class,
        "courses": course_map
    })))
}

pub async fn create_student(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Json(payload): Json<StudentInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let mut tx = pool.begin().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let result = sqlx::query(
        "INSERT INTO students (first_name, last_name, school_number, birth_date, student_class) VALUES (?, ?, ?, ?, ?)"
    )
    .bind(&payload.first_name)
    .bind(&payload.last_name)
    .bind(&payload.school_number)
    .bind(&payload.birth_date)
    .bind(&payload.student_class)
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let student_id = result.last_insert_id() as i32;

    for (course, grade) in &payload.courses {
        sqlx::query("INSERT INTO student_courses (student_id, course, grade) VALUES (?, ?, ?)")
            .bind(student_id)
            .bind(course)
            .bind(grade)
            .execute(&mut *tx)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;
    }

    tx.commit().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok((StatusCode::CREATED, Json(serde_json::json!({
        "id": student_id,
        "firstName": payload.first_name,
        "lastName": payload.last_name,
        "schoolNumber": payload.school_number,
        "birthDate": payload.birth_date,
        "studentClass": payload.student_class,
        "courses": payload.courses
    }))))
}

pub async fn update_student(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
    Json(payload): Json<StudentInput>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let mut tx = pool.begin().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let exists = sqlx::query("SELECT 1 FROM students WHERE id = ?")
        .bind(id)
        .fetch_optional(&mut *tx)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if exists.is_none() {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Student not found"}))));
    }

    sqlx::query(
        "UPDATE students SET first_name = ?, last_name = ?, school_number = ?, birth_date = ?, student_class = ? WHERE id = ?"
    )
    .bind(&payload.first_name)
    .bind(&payload.last_name)
    .bind(&payload.school_number)
    .bind(&payload.birth_date)
    .bind(&payload.student_class)
    .bind(id)
    .execute(&mut *tx)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    sqlx::query("DELETE FROM student_courses WHERE student_id = ?")
        .bind(id)
        .execute(&mut *tx)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    for (course, grade) in &payload.courses {
        sqlx::query("INSERT INTO student_courses (student_id, course, grade) VALUES (?, ?, ?)")
            .bind(id)
            .bind(course)
            .bind(grade)
            .execute(&mut *tx)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;
    }

    tx.commit().await.map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    Ok(Json(serde_json::json!({
        "id": id,
        "firstName": payload.first_name,
        "lastName": payload.last_name,
        "schoolNumber": payload.school_number,
        "birthDate": payload.birth_date,
        "studentClass": payload.student_class,
        "courses": payload.courses
    })))
}

pub async fn delete_student(
    State(pool): State<DbPool>,
    _user: CurrentUser,
    Path(id): Path<i32>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let result = sqlx::query("DELETE FROM students WHERE id = ?")
        .bind(id)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if result.rows_affected() == 0 {
        return Err((StatusCode::NOT_FOUND, Json(serde_json::json!({"message": "Student not found"}))));
    }

    Ok(StatusCode::NO_CONTENT)
}
