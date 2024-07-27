import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"

export default function CreateAboutWindow() {
    const window = WebviewWindow.getByLabel('about')
    if (window) {
        window.show()
        window.unminimize()
        window.setFocus()
        return
    }
    let webview = new WebviewWindow("about", {
        url: "/about",
        title: "关于linyu",
        width: 360,
        height: 510,
        decorations: false,
        center: true,
        transparent: true,
        resizable: false,
        shadow: false,
        focus: true
    });
}