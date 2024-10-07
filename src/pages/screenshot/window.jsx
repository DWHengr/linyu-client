import {WebviewWindow} from "@tauri-apps/api/webviewWindow"
import {setItem} from "../../utils/storage.js";

export default async function CreateScreenshot(toUserWindowLabel) {
    await setItem("screenshot", {toUserWindowLabel})
    const window = await WebviewWindow.getByLabel("screenshot")
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