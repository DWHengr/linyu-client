import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"
import {setItem} from "../../utils/storage.js";

export default async function CreateVideoChat(userId, isSender, isOnlyAudio = false) {
    await setItem("video-chat", {userId, isSender, isOnlyAudio})
    const window = await WebviewWindow.getByLabel(`video-chat`)
    if (window) {
        await window.show()
        await window.setFocus()
        return
    }
    let webview = new WebviewWindow(`video-chat`, {
        url: "/videochat",
        width: isOnlyAudio ? 370 : 750,
        height: 600,
        title: "linyu",
        center: true,
        transparent: true,
        decorations: false,
        resizable: false,
        shadow: false,
        focus: true,
    });
}