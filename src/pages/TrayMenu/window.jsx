import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"


export let trayWindowWidth = 120
export let trayWindowHeight = 160

export default function CreateTrayWindow(position) {
    let webview = new WebviewWindow("tray_menu", {
        url: "/tray",
        width: trayWindowWidth,
        height: trayWindowHeight,
        skipTaskbar: true,
        decorations: false,
        focus: false,
        center: false,
        transparent: true,
        resizable: false,
        shadow: false
    });
    webview.setAlwaysOnTop(true)
    webview.setPosition(position)
    webview.show()
    webview.setFocus()
    webview.listen("tauri://blur", function () {
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
}