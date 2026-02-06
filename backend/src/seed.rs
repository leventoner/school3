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
        
        let admin_role = sqlx::query_as::<_, Role>("SELECT * FROM roles WHERE name = 'ROLE_ADMIN'")
            .fetch_one(pool)
            .await?;
            
        sqlx::query("INSERT INTO user_roles (user_id, role_id) VALUES (?, ?)")
            .bind(user_id as i32)
            .bind(admin_role.id)
            .execute(pool)
            .await?;
            
        println!("Root user created.");
    }

    Ok(())
}
