import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"
import {listen} from "@tauri-apps/api/event";
import {PhysicalPosition} from "@tauri-apps/api/window";
import {trayWindowHeight} from "../TrayMenu/window.jsx";

listen('tray_menu', async (event) => {

    const homeWindow = WebviewWindow.getByLabel('home')
    if (!homeWindow) return

    let position = event.payload;
    let scaleFactor = await homeWindow.scaleFactor();
    let logicalPosition = new PhysicalPosition(position.x, position.y).toLogical(scaleFactor);
    logicalPosition = new PhysicalPosition(logicalPosition.x, logicalPosition.y).toLogical(scaleFactor);
    logicalPosition.y = logicalPosition.y - trayWindowHeight

    let trayWindow = WebviewWindow.getByLabel('tray_menu')
    if (trayWindow) {
        await trayWindow.setAlwaysOnTop(true)
        await trayWindow.setPosition(logicalPosition)
        await trayWindow.show()
        await trayWindow.setFocus()
    }
})

export default function CreateHomeWindow() {
    let webview = new WebviewWindow("home", {
        url: "/home",
        title: "linyu",
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
    });
}