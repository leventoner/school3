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
