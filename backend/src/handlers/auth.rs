use axum::{
    extract::State,
    Json,
    http::StatusCode,
    response::IntoResponse,
};
use serde::{Deserialize, Serialize};
use crate::db::DbPool;
use crate::models::{User, Role};
use crate::auth::{create_jwt, hash_password, verify_password};

#[derive(Deserialize)]
pub struct LoginRequest {
    pub username: String,
    pub password: String,
}

#[derive(Serialize)]
pub struct TokenResponse {
    pub token: String,
    pub id: i64,
    pub username: String,
    pub email: String,
    pub roles: Vec<String>,
    #[serde(rename = "type")]
    pub token_type: String,
}

#[derive(Deserialize)]
pub struct SignupRequest {
    pub username: String,
    pub email: String,
    pub password: String,
    pub role: Option<Vec<String>>,
}

pub async fn signin(
    State(pool): State<DbPool>,
    Json(payload): Json<LoginRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    let user = sqlx::query_as::<_, User>("SELECT * FROM users WHERE username = ?")
        .bind(&payload.username)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?
        .ok_or((StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "Incorrect username or password"}))))?;

    if !verify_password(&payload.password, &user.password).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))? {
        return Err((StatusCode::UNAUTHORIZED, Json(serde_json::json!({"message": "Incorrect username or password"}))));
    }

    let token = create_jwt(&user.username).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let roles = sqlx::query_as::<_, Role>(
        "SELECT r.* FROM roles r JOIN user_roles ur ON r.id = ur.role_id WHERE ur.user_id = ?"
    )
    .bind(user.id)
    .fetch_all(&pool)
    .await
    .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let role_names = roles.into_iter().map(|r| r.name).collect();

    Ok(Json(TokenResponse {
        token,
        id: user.id,
        username: user.username,
        email: user.email,
        roles: role_names,
        token_type: "Bearer".to_string(),
    }))
}

pub async fn signup(
    State(pool): State<DbPool>,
    Json(payload): Json<SignupRequest>,
) -> Result<impl IntoResponse, (StatusCode, Json<serde_json::Value>)> {
    // Check if username exists
    let exists = sqlx::query("SELECT 1 FROM users WHERE username = ?")
        .bind(&payload.username)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if exists.is_some() {
        return Err((StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Error: Username is already taken!"}))));
    }

    // Check if email exists
    let email_exists = sqlx::query("SELECT 1 FROM users WHERE email = ?")
        .bind(&payload.email)
        .fetch_optional(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    if email_exists.is_some() {
        return Err((StatusCode::BAD_REQUEST, Json(serde_json::json!({"message": "Error: Email is already in use!"}))));
    }

    let hashed = hash_password(&payload.password).map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let result = sqlx::query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
        .bind(&payload.username)
        .bind(&payload.email)
        .bind(hashed)
        .execute(&pool)
        .await
        .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

    let user_id = result.last_insert_id();

    // Assign roles
    let str_roles = payload.role.unwrap_or_else(|| vec!["user".to_string()]);
    let mut roles_to_assign = Vec::new();

    if str_roles.is_empty() {
        roles_to_assign.push("ROLE_USER".to_string());
    } else {
        for role in str_roles {
            let role_name = match role.to_lowercase().as_str() {
                "admin" => "ROLE_ADMIN",
                "mod" => "ROLE_MODERATOR",
                _ => "ROLE_USER",
            };
            if !roles_to_assign.contains(&role_name.to_string()) {
                roles_to_assign.push(role_name.to_string());
            }
        }
    }

    for role_name in roles_to_assign {
        let role = sqlx::query_as::<_, Role>("SELECT * FROM roles WHERE name = ?")
            .bind(role_name)
            .fetch_one(&pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;

        sqlx::query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)")
            .bind(user_id as i64)
            .bind(role.id)
            .execute(&pool)
            .await
            .map_err(|e| (StatusCode::INTERNAL_SERVER_ERROR, Json(serde_json::json!({"error": e.to_string()}))))?;
    }

    Ok((StatusCode::CREATED, Json(serde_json::json!({"message": "User registered successfully!"}))))
}
