import {appWindow, WebviewWindow} from "@tauri-apps/api/window";

export default function CreateChatWindow(user) {
    let webview = new WebviewWindow("chat-" + user, {
        url: "/chat",
        center: true,
        width: 760,
        minWidth: 600,
        height: 800,
        minHeight: 600,
        decorations: false,
        transparent: true
    });
}