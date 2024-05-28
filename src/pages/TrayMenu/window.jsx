import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"
import {LogicalPosition, PhysicalPosition} from "@tauri-apps/api/window";


export let trayWindowWidth = 120
export let trayWindowHeight = 160

export default async function CreateTrayWindow() {
    let webview = new WebviewWindow("tray_menu", {
        url: "/tray",
        title: "linyu",
        width: trayWindowWidth,
        height: trayWindowHeight,
        skipTaskbar: true,
        decorations: false,
        center: false,
        transparent: true,
        resizable: false,
        shadow: false,
        alwaysOnTop: true,
        focus: true
    });
    await webview.setPosition(new PhysicalPosition(0, window.innerHeight + 100))
    await webview.listen("tauri://blur", function () {
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
    await webview.listen("tauri://window-created", function () {
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
}