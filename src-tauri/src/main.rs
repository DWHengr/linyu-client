// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]
mod tray;
mod user_cmd;
use user_cmd::{get_user_info, save_user_info,default_window_icon,screenshot,audio};

fn main() {
    tauri::Builder::default()
        .plugin(tauri_plugin_process::init())
        .plugin(tauri_plugin_http::init())
        .plugin(tauri_plugin_websocket::init())
        .plugin(tauri_plugin_shell::init())
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_upload::init())
        .plugin(tauri_plugin_dialog::init())
        .plugin(tauri_plugin_clipboard_manager::init())
        .setup(move |app| {
            tray::create_tray(app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![get_user_info, save_user_info,default_window_icon,screenshot,audio])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
