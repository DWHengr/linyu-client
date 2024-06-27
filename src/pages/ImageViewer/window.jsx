import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"
import {setItem} from "../../utils/storage.js";

export default async function CreateImageViewer(fileName, url) {
    await setItem("image-viewer-url", {fileName, url})
    const window = WebviewWindow.getByLabel("image-viewer")
    if (window) {
        await window.show()
        await window.setFocus()
        return
    }
    let webview = new WebviewWindow("image-viewer", {
        url: "/imageviewer",
        width: 800,
        title: "linyu",
        height: 650,
        center: true,
        decorations: false,
        resizable: false,
        focus: true,
    });

}