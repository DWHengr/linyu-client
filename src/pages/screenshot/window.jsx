import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"

export default async function CreateScreenshot() {
    const window = WebviewWindow.getByLabel("screenshot")
    if (window) {
        await window.show()
        await window.setFocus()
        return
    }
    let webview = new WebviewWindow("screenshot", {
        url: "/screenshot",
        width: 500,
        height: 500,
        center: false,
        transparent: true,
        resizable: false,
        shadow: false,
        alwaysOnTop: true,
        focus: true,
        fullscreen: true,
    });
}