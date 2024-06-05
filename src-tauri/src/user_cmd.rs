use lazy_static::lazy_static;
use serde::Serialize;
use std::sync::{Arc, RwLock};
use tauri::{
    Manager, Runtime,AppHandle,ResourceId,Webview
};

// 定义用户信息结构体
#[derive(Debug, Clone, Serialize)]
pub struct UserInfo {
    user_id: String,
    username: String,
    token: String,
    portrait: String,
}

// 全局变量
lazy_static! {
    static ref USER_INFO: Arc<RwLock<UserInfo>> = Arc::new(RwLock::new(UserInfo {
        user_id: String::new(),
        username: String::new(),
        token: String::new(),
        portrait: String::new(),
    }));
}

// 保存用户信息的方法
#[tauri::command]
pub fn save_user_info(userid: &str, username: &str, token: &str, portrait: &str) -> i32 {
    let mut user_info = USER_INFO.write().unwrap();
    user_info.user_id = userid.to_string();
    user_info.username = username.to_string();
    user_info.token = token.to_string();
    user_info.portrait = portrait.to_string();
    0
}

// 获取用户信息的方法
#[tauri::command]
pub fn get_user_info() -> UserInfo {
    let user_info = USER_INFO.read().unwrap();
    user_info.clone()
}

#[tauri::command]
pub fn default_window_icon<R: Runtime>(
  webview: Webview<R>,
  app: AppHandle<R>,
) -> Option<ResourceId> {
  app.default_window_icon().cloned().map(|icon| {
    let mut resources_table = webview.resources_table();
    resources_table.add(icon.to_owned())
  })
}