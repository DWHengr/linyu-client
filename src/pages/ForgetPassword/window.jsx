import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"

export default async function CreateForgetWindow() {
    const window = await WebviewWindow.getByLabel('forget')
    if (window) {
        window.show()
        window.unminimize()
        window.setFocus()
        return
    }
    let webview = new WebviewWindow("forget", {
        url: "/forget",
        title: "找回密码",
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
