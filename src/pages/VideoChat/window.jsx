import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"

export default async function CreateVideoChat(userId, isSender) {

    const window = WebviewWindow.getByLabel(`${userId}-${userId}-${isSender ? "y" : "n"}`)
    if (window) {
        await window.show()
        await window.setFocus()
        return
    }
    let webview = new WebviewWindow(`${userId}-${userId}-${isSender ? "y" : "n"}`, {
        url: "/videochat",
        width: 750,
        height: 600,
        center: true,
        transparent: true,
        decorations: false,
        resizable: false,
        shadow: false,
        focus: true,
    });
}