import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"

export default function CreateHomeWindow() {
    let webview = new WebviewWindow("home", {
        url: "/home",
        center: true,
        width: 1010,
        minWidth: 900,
        height: 750,
        minHeight: 600,
        decorations: false,
        transparent: true,
        shadow: false
    });
    webview.once("tauri://webview-created", function () {
        const appWindow = WebviewWindow.getByLabel('login')
        appWindow?.close();
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        trayWindow?.hide();
    });
}