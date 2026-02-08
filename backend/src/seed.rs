use crate::db::DbPool;
use crate::models::{Role, User};
use crate::auth::hash_password;

pub async fn seed_data(pool: &DbPool) -> anyhow::Result<()> {
    // Seed Roles
    let roles = vec!["ROLE_USER", "ROLE_ADMIN", "ROLE_MODERATOR"];
    for role_name in roles {
        let exists = sqlx::query("SELECT 1 FROM roles WHERE name = ?")
            .bind(role_name)
            .fetch_optional(pool)
            .await?;
        
        if exists.is_none() {
            println!("Adding role: {}", role_name);
            sqlx::query("INSERT INTO roles (name) VALUES (?)")
                .bind(role_name)
                .execute(pool)
                .await?;
        }
    }

    // Seed Root User
    let root_exists = sqlx::query("SELECT 1 FROM users WHERE username = 'root'")
        .fetch_optional(pool)
        .await?;

    if root_exists.is_none() {
        println!("Creating root user...");
        let hashed = hash_password("root")?;
        
        let result = sqlx::query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)")
            .bind("root")
            .bind("root@example.com")
            .bind(hashed)
            .execute(pool)
            .await?;
            
        let user_id = result.last_insert_id();
        
        let admin_role = sqlx::query_as::<sqlx::MySql, Role>("SELECT * FROM roles WHERE name = 'ROLE_ADMIN'")
            .fetch_one(pool)
            .await?;
            
        sqlx::query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)")
            .bind(user_id as i64)
            .bind(admin_role.id)
            .execute(pool)
            .await?;
            
        println!("Root user created.");
    }

    // Seed Teachers
    let teacher_exists = sqlx::query("SELECT 1 FROM teachers LIMIT 1")
        .fetch_optional(pool)
        .await?;

    if teacher_exists.is_none() {
        println!("Seeding initial teachers...");
        let teachers = vec![
            ("John", "Doe", "john.doe@school.com", "555-0101", "Mathematics"),
            ("Jane", "Smith", "jane.smith@school.com", "555-0102", "Physics"),
            ("Robert", "Brown", "robert.b@school.com", "555-0103", "Computer Science"),
        ];

        for (f, l, e, p, s) in teachers {
            sqlx::query("INSERT INTO teachers (first_name, last_name, email, phone, specialization) VALUES (?, ?, ?, ?, ?)")
                .bind(f)
                .bind(l)
                .bind(e)
                .bind(p)
                .bind(s)
                .execute(pool)
                .await?;
        }
    }

    // Seed Classrooms
    let classroom_exists = sqlx::query("SELECT 1 FROM classrooms LIMIT 1")
        .fetch_optional(pool)
        .await?;

    if classroom_exists.is_none() {
        println!("Seeding initial classrooms...");
        let classrooms = vec![
            ("101", 30, "Lecture Hall", 1),
            ("102", 25, "Lecture Hall", 1),
            ("LAB-A", 20, "Computer Lab", 2),
            ("SCI-1", 24, "Science Lab", 2),
            ("GYM", 100, "Gymnasium", 0),
        ];

        for (n, c, t, f) in classrooms {
            sqlx::query("INSERT INTO classrooms (room_number, capacity, room_type, floor) VALUES (?, ?, ?, ?)")
                .bind(n)
                .bind(c)
                .bind(t)
                .bind(f)
                .execute(pool)
                .await?;
        }
    }

    // Seed Books
    let book_exists = sqlx::query("SELECT 1 FROM books LIMIT 1")
        .fetch_optional(pool)
        .await?;

    if book_exists.is_none() {
        println!("Seeding initial books...");
        let books = vec![
            ("Introduction to Algorithms", "T. Cormen", "978-0262033848", "Computer Science", "Available"),
            ("Clean Code", "Robert C. Martin", "978-0132350884", "Software Engineering", "Available"),
            ("Design Patterns", "GoF", "978-0201633610", "Software Engineering", "Borrowed"),
            ("The Art of Computer Programming", "Donald Knuth", "978-0201896831", "Computer Science", "Available"),
        ];

        for (t, a, i, c, s) in books {
            sqlx::query("INSERT INTO books (title, author, isbn, category, status) VALUES (?, ?, ?, ?, ?)")
                .bind(t)
                .bind(a)
                .bind(i)
                .bind(c)
                .bind(s)
                .execute(pool)
                .await?;
        }
    }


    // Seed Attendance
    let att_exists = sqlx::query("SELECT 1 FROM attendance LIMIT 1")
        .fetch_optional(pool)
        .await?;
    
    if att_exists.is_none() {
        println!("Seeding attendance...");
        let students = sqlx::query("SELECT id FROM students LIMIT 5").fetch_all(pool).await?;
        let today = "2026-02-08";
        for s in students {
            let sid: i32 = s.get(0);
            sqlx::query("INSERT INTO attendance (student_id, date, status) VALUES (?, ?, ?)")
                .bind(sid)
                .bind(today)
                .bind("Present")
                .execute(pool)
                .await?;
        }
    }

    // Seed Grades
    let grade_exists = sqlx::query("SELECT 1 FROM grades LIMIT 1")
        .fetch_optional(pool)
        .await?;

    if grade_exists.is_none() {
        println!("Seeding grades...");
        let students = sqlx::query("SELECT id FROM students LIMIT 5").fetch_all(pool).await?;
        for s in students {
            let sid: i32 = s.get(0);
            sqlx::query("INSERT INTO grades (student_id, subject, score, exam_date) VALUES (?, ?, ?, ?)")
                .bind(sid)
                .bind("Mathematics")
                .bind(85.5)
                .bind("2026-01-15")
                .execute(pool)
                .await?;
        }
    }

    Ok(())
}
