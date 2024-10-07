import {WebviewWindow} from "@tauri-apps/api/webviewWindow"


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
        focus: true,
        x: 0,
        y: window.screen.height + 100
    });
    await webview.listen("tauri://blur", async function () {
        const trayWindow = await WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
    await webview.listen("tauri://window-created", async function () {
        const trayWindow = await WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
}