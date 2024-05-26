import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"

export default function CreateChatWindow(user) {
    const window = WebviewWindow.getByLabel('chat-' + user)
    if (window) {
        window.show()
        window.unminimize()
        window.setFocus()
        return
    }
    let webview = new WebviewWindow("chat-" + user, {
        url: "/chat",
        center: true,
        width: 760,
        minWidth: 600,
        height: 800,
        minHeight: 600,
        decorations: false,
        transparent: true,
        shadow: false
    });
}