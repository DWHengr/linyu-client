import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"
import {setItem} from "../../utils/storage.js";
import {getAllWindows} from "@tauri-apps/api/window";
import {TrayIcon} from "@tauri-apps/api/tray";
import {invoke} from "@tauri-apps/api/core";

export default async function CreateLogin() {
    TrayIcon.getById("tray").then(async (res) => {
        res.setTooltip("linyu")
    })
    const window = await WebviewWindow.getByLabel(`login`)
    if (window) {
        await window.show()
        await window.setFocus()
        return
    }
    let webview = new WebviewWindow(`login`, {
        url: "/login",
        width: 360,
        height: 510,
        title: "林语",
        center: true,
        transparent: true,
        decorations: false,
        resizable: false,
        fullscreen: false,
        shadow: false,
    });
    webview.once("tauri://webview-created", async function () {
        let windows = await getAllWindows()
        windows?.map(w => {
            if (w.label !== 'login') {
                w.close();
            }
        })
    });
}