mod db;
mod models;
mod handlers;
mod auth;
mod seed;

use axum::{
    routing::{get, post, put, delete},
    Router,
};
use std::net::SocketAddr;
use tower_http::cors::{Any, CorsLayer};
use crate::db::init_pool;
use crate::handlers::{auth::{signin, signup}, students::{get_all_students, get_student, create_student, update_student, delete_student}};

#[tokio::main]
async fn main() -> anyhow::Result<()> {
    // Load environment variables
    dotenvy::dotenv().ok();
    
    // Initialize tracing
    tracing_subscriber::fmt::init();

    // Initialize database pool
    let pool = init_pool().await?;

    // Create tables if they don't exist
    sqlx::query("CREATE TABLE IF NOT EXISTS roles (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(20) NOT NULL UNIQUE)")
        .execute(&pool).await?;
    sqlx::query("CREATE TABLE IF NOT EXISTS users (id BIGINT AUTO_INCREMENT PRIMARY KEY, username VARCHAR(20) NOT NULL UNIQUE, email VARCHAR(50) NOT NULL UNIQUE, password VARCHAR(120) NOT NULL)")
        .execute(&pool).await?;
    sqlx::query("CREATE TABLE IF NOT EXISTS user_roles (user_id BIGINT NOT NULL, role_id INT NOT NULL, PRIMARY KEY (user_id, role_id), FOREIGN KEY (user_id) REFERENCES users(id), FOREIGN KEY (role_id) REFERENCES roles(id))")
        .execute(&pool).await?;
    sqlx::query("CREATE TABLE IF NOT EXISTS students (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), school_number VARCHAR(255), birth_date VARCHAR(255), student_class VARCHAR(255))")
        .execute(&pool).await?;
    sqlx::query("CREATE TABLE IF NOT EXISTS student_courses (student_id INT, course VARCHAR(50), grade VARCHAR(50), PRIMARY KEY(student_id, course), FOREIGN KEY(student_id) REFERENCES students(id) ON DELETE CASCADE)")
        .execute(&pool).await?;

    // Seed data
    seed::seed_data(&pool).await?;
    // CORS configuration
    let cors = CorsLayer::new()
        .allow_origin(Any)
        .allow_methods(Any)
        .allow_headers(Any);

    // API routes
    let app = Router::new()
        .route("/", get(|| async { "Welcome to the Student Management API (Rust)" }))
        .route("/api/auth/signin", post(signin))
        .route("/api/auth/signup", post(signup))
        .route("/api/students", get(get_all_students).post(create_student))
        .route("/api/students/", get(get_all_students).post(create_student))
        .route("/api/students/:id", get(get_student).put(update_student).delete(delete_student))
        .layer(cors)
        .with_state(pool);

    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], 8083));
    tracing::info!("listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
