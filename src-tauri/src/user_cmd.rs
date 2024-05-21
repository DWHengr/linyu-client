use lazy_static::lazy_static;
use serde::Serialize;
use std::sync::{Arc, RwLock};

// 定义用户信息结构体
#[derive(Debug, Clone, Serialize)]
pub struct UserInfo {
    user_id: String,
    username: String,
    token: String,
}

// 全局变量
lazy_static! {
    static ref USER_INFO: Arc<RwLock<UserInfo>> = Arc::new(RwLock::new(UserInfo {
        user_id: String::new(),
        username: String::new(),
        token: String::new(),
    }));
}

// 保存用户信息的方法
#[tauri::command]
pub fn save_user_info(userid: &str, username: &str, token: &str) {
    let mut user_info = USER_INFO.write().unwrap();
    user_info.user_id = userid.to_string();
    user_info.username = username.to_string();
    user_info.token = token.to_string();
}

// 获取用户信息的方法
#[tauri::command]
pub fn get_user_info() -> UserInfo {
    let user_info = USER_INFO.read().unwrap();
    user_info.clone()
}
