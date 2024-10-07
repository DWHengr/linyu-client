import {WebviewWindow} from "@tauri-apps/api/webviewWindow"
import {PhysicalPosition} from "@tauri-apps/api/window";

export default async function CreateCmdWindow() {
    let webview = await WebviewWindow.getByLabel('command')
    if (webview) {
        await webview.show()
        await webview.setFocus()
        await webview.unminimize()
        return
    }
    webview = new WebviewWindow("command", {
        url: "/command",
        title: "命名行模式",
        width: 800,
        height: 500,
        decorations: false,
        transparent: true,
        shadow: false,
        resizable: false,
        alwaysOnTop: true,
        skipTaskbar: true,
        x: 0,
        y: window.screen.height + 100
    });
    await webview.listen("tauri://window-created", async function () {
        await webview.hide();
        await webview.center()
    });
}