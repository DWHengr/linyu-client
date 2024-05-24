use tauri::{
    tray::{ClickType, TrayIconBuilder},
    Manager, Runtime
};

pub fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let _ = TrayIconBuilder::new()
        .tooltip("linyu")
        .icon(app.default_window_icon().unwrap().clone())
        .on_tray_icon_event(|tray, event| {
            if event.click_type == ClickType::Left {
                let windows = tray.app_handle().webview_windows();
                for (key, value) in windows {
                    if key == "login" || key == "home" {
                        value.show().unwrap();
                        value.unminimize().unwrap();
                        value.set_focus().unwrap();
                    }
                }
            }
            if event.click_type == ClickType::Right {
             tray.app_handle().emit("tray_menu", event.position).unwrap();
            }
        })
        .build(app);
    Ok(())
}
