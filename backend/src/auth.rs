use jsonwebtoken::{encode, Header, EncodingKey};
use serde::{Deserialize, Serialize};
use chrono::{Utc, Duration};
use bcrypt::{hash, verify, DEFAULT_COST};

pub const SECRET_KEY: &[u8] = b"thisisasecretkeyforjwttokengenerationanditshouldbeverylongandsecure";

#[derive(Debug, Serialize, Deserialize)]
pub struct Claims {
    pub sub: String,
    pub exp: i64,
}

pub fn create_jwt(username: &str) -> anyhow::Result<String> {
    let expiration = Utc::now()
        .checked_add_signed(Duration::days(1))
        .expect("valid timestamp")
        .timestamp();

    let claims = Claims {
        sub: username.to_owned(),
        exp: expiration,
    };

    let token = encode(&Header::default(), &claims, &EncodingKey::from_secret(SECRET_KEY))?;
    Ok(token)
}

pub fn hash_password(password: &str) -> anyhow::Result<String> {
    let hashed = hash(password, DEFAULT_COST)?;
    Ok(hashed)
}

pub fn verify_password(password: &str, hashed: &str) -> anyhow::Result<bool> {
    let is_valid = verify(password, hashed)?;
    Ok(is_valid)
}
