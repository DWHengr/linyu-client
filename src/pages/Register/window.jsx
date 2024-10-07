import {WebviewWindow} from "@tauri-apps/api/webviewWindow"

export default async function CreateRegisterWindow() {
    const window = await WebviewWindow.getByLabel('register')
    if (window) {
        window.show()
        window.unminimize()
        window.setFocus()
        return
    }
    let webview = new WebviewWindow("register", {
        url: "/register",
        title: "注册",
        width: 640,
        height: 500,
        decorations: false,
        center: true,
        transparent: true,
        resizable: false,
        shadow: false,
        focus: true
    });
}