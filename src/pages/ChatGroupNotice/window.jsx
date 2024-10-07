import {WebviewWindow} from "@tauri-apps/api/webviewWindow"
import {setItem} from "../../utils/storage.js";

export default async function CreateChatGroupNotice(groupId) {
    await setItem("notice", {groupId})
    const window = await WebviewWindow.getByLabel('notice')
    if (window) {
        window.show()
        window.unminimize()
        window.setFocus()
        return
    }
    let webview = new WebviewWindow("notice", {
        url: "/notice",
        title: "群公告",
        width: 480,
        height: 530,
        decorations: false,
        center: true,
        transparent: true,
        resizable: false,
        shadow: false,
        focus: true
    });
}