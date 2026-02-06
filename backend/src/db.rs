use sqlx::mysql::MySqlPoolOptions;
use sqlx::{MySql, Pool};
use std::env;

pub type DbPool = Pool<MySql>;

pub async fn init_pool() -> anyhow::Result<DbPool> {
    let database_url = env::var("DATABASE_URL")
        .expect("DATABASE_URL must be set");
    
    let pool = MySqlPoolOptions::new()
        .max_connections(5)
        .connect(&database_url)
        .await?;
        
    Ok(pool)
}
