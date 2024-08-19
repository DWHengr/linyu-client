import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"

export let messageBoxWindowWidth = 280
export let messageBoxWindowHeight = 90

export default async function CrateMessageBox() {
    let webview = new WebviewWindow("massage-box", {
        url: "/messagebox",
        title: "linyu",
        width: messageBoxWindowWidth,
        height: messageBoxWindowHeight,
        skipTaskbar: true,
        decorations: false,
        center: false,
        transparent: true,
        resizable: false,
        shadow: false,
        alwaysOnTop: true,
        focus: true,
        x: 0,
        y: window.screen.height + 100
    });
    await webview.listen("tauri://blur", function () {
        const window = WebviewWindow.getByLabel('massage-box')
        window.hide();
    });
    await webview.listen("tauri://window-created", function () {
        const window = WebviewWindow.getByLabel('massage-box')
        window.hide();
    });
}