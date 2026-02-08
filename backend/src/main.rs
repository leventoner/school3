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
use crate::handlers::{
    auth::{signin, signup}, 
    students::{get_all_students, get_student, create_student, update_student, delete_student},
    teachers::{get_all_teachers, get_teacher, create_teacher, update_teacher, delete_teacher},
    classrooms::{get_all_classrooms, get_classroom, create_classroom, update_classroom, delete_classroom},
    library::{get_all_books, get_book, create_book, update_book, delete_book},
    attendance::{get_all_attendance, get_student_attendance, create_attendance, delete_attendance},
    grades::{get_all_grades, get_student_grades, create_grade, update_grade, delete_grade},
    dashboard::get_dashboard_stats
};

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
    sqlx::query("CREATE TABLE IF NOT EXISTS teachers (id INT AUTO_INCREMENT PRIMARY KEY, first_name VARCHAR(255), last_name VARCHAR(255), email VARCHAR(255) UNIQUE, phone VARCHAR(50), specialization VARCHAR(255))")
        .execute(&pool).await?;
    sqlx::query("CREATE TABLE IF NOT EXISTS classrooms (id INT AUTO_INCREMENT PRIMARY KEY, room_number VARCHAR(50) NOT NULL, capacity INT, room_type VARCHAR(100), floor INT)")
        .execute(&pool).await?;
    sqlx::query("CREATE TABLE IF NOT EXISTS books (id INT AUTO_INCREMENT PRIMARY KEY, title VARCHAR(255) NOT NULL, author VARCHAR(255), isbn VARCHAR(50), category VARCHAR(100), status VARCHAR(20) DEFAULT 'Available')")
        .execute(&pool).await?;
    sqlx::query("CREATE TABLE IF NOT EXISTS attendance (id INT AUTO_INCREMENT PRIMARY KEY, student_id INT NOT NULL, date DATE NOT NULL, status VARCHAR(20) NOT NULL, FOREIGN KEY (student_id) REFERENCES students(id))")
        .execute(&pool).await?;
    sqlx::query("CREATE TABLE IF NOT EXISTS grades (id INT AUTO_INCREMENT PRIMARY KEY, student_id INT NOT NULL, subject VARCHAR(100) NOT NULL, score DECIMAL(5,2) NOT NULL, exam_date DATE NOT NULL, FOREIGN KEY (student_id) REFERENCES students(id))")
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
        .route("/api/teachers", get(get_all_teachers).post(create_teacher))
        
        // Fix: Explicitly handle trailing slash for teachers
        .route("/api/teachers/", get(get_all_teachers).post(create_teacher))
        
        .route("/api/teachers/:id", get(get_teacher).put(update_teacher).delete(delete_teacher))
        .route("/api/classrooms", get(get_all_classrooms).post(create_classroom))
        .route("/api/classrooms/:id", get(get_classroom).put(update_classroom).delete(delete_classroom))
        .route("/api/books", get(get_all_books).post(create_book))
        .route("/api/books/:id", get(get_book).put(update_book).delete(delete_book))
        .route("/api/attendance", get(get_all_attendance).post(create_attendance))
        .route("/api/attendance/student/:id", get(get_student_attendance))
        .route("/api/attendance/:id", delete(delete_attendance))
        .route("/api/grades", get(get_all_grades).post(create_grade))
        .route("/api/grades/student/:id", get(get_student_grades))
        .route("/api/grades/:id", put(update_grade).delete(delete_grade))
        .route("/api/dashboard", get(get_dashboard_stats))
        .layer(cors)
        .with_state(pool);

    // Start server
    let addr = SocketAddr::from(([0, 0, 0, 0], 8083));
    tracing::info!("listening on {}", addr);
    
    let listener = tokio::net::TcpListener::bind(addr).await?;
    axum::serve(listener, app).await?;

    Ok(())
}
