import {WebviewWindow} from "@tauri-apps/api/webviewWindow"
import {emit} from "@tauri-apps/api/event";
import {setItem} from "../../utils/storage.js";

export default async function CreateChatWindow(userId, username, type) {
    await setItem("chat-windows-" + userId, {userId, username, type})
    const window = await WebviewWindow.getByLabel('chat--' + userId)
    if (window) {
        window.show()
        window.unminimize()
        window.setFocus()
        return
    }
    let webview = new WebviewWindow("chat--" + userId, {
        url: "/chat",
        title: username,
        center: true,
        width: 760,
        minWidth: 600,
        height: 800,
        minHeight: 600,
        decorations: false,
        transparent: true,
        shadow: false
    });
    webview.listen("tauri://destroyed", function (event) {
        let fromId = webview.label.split('--')[1]
        emit("chat-destroyed", {fromId: fromId})
    });
}