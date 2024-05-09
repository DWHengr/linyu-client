// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn greet(name: &str) -> String {
    format!("Hello, {}! You've been greeted from Rust!", name)
}
use serde::de::value;
use tauri::{AppHandle, Manager, SystemTray, SystemTrayEvent, Wry};

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![greet])
        .system_tray(SystemTray::new())
        .on_system_tray_event(system_tray_event)
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

// system tray event fn
fn system_tray_event(app: &AppHandle<Wry>, e: SystemTrayEvent) {
    match e {
        SystemTrayEvent::LeftClick {
            position: _,
            size: _,
            ..
        } => {
            let windows = app.windows();
            for (key, value) in windows {
                if key == "login" || key == "home" {
                    value.show().unwrap();
                    value.unminimize().unwrap();
                    value.set_focus().unwrap();
                }
            }
        }
        SystemTrayEvent::RightClick {
            position: p,
            size: s,
            ..
        } => {
            app.emit_all("tray_menu", (p, s)).unwrap();
        }
        _ => {}
    }
}
