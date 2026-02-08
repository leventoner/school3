use serde::{Deserialize, Serialize};
use sqlx::FromRow;

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Role {
    pub id: i32,
    pub name: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct User {
    pub id: i64,
    pub username: String,
    pub email: String,
    pub password: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Student {
    pub id: i32,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub school_number: Option<String>,
    pub birth_date: Option<String>,
    pub student_class: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct StudentCourse {
    pub student_id: i32,
    pub course: String,
    pub grade: Option<String>,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct StudentWithCourses {
    #[serde(flatten)]
    pub student: Student,
    pub courses: Vec<StudentCourse>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Teacher {
    pub id: i32,
    pub first_name: Option<String>,
    pub last_name: Option<String>,
    pub email: Option<String>,
    pub phone: Option<String>,
    pub specialization: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Classroom {
    pub id: i32,
    pub room_number: String,
    pub capacity: Option<i32>,
    pub room_type: Option<String>,
    pub floor: Option<i32>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Book {
    pub id: i32,
    pub title: String,
    pub author: Option<String>,
    pub isbn: Option<String>,
    pub category: Option<String>,
    pub status: Option<String>,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Attendance {
    pub id: i32,
    pub student_id: i32,
    pub date: String, // SQLX mappings for dates can be tricky, using String for simplicity or NaiveDate if configured
    pub status: String,
}

#[derive(Debug, Serialize, Deserialize, FromRow)]
pub struct Grade {
    pub id: i32,
    pub student_id: i32,
    pub subject: String,
    pub score: f64,
    pub exam_date: String,
}
