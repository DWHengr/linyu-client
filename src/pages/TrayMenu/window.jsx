import {WebviewWindow} from "@tauri-apps/api/WebviewWindow"
import {listen} from "@tauri-apps/api/event";
import {LogicalPosition, PhysicalPosition, Window} from "@tauri-apps/api/window";


let width = 120
let height = 160

listen('tray_menu', async (event) => {
    const homeWindow = WebviewWindow.getByLabel('home')
    if (!homeWindow) return
    let position = event.payload;
    const trayWindow = WebviewWindow.getByLabel('tray_menu')
    if (trayWindow) {
        let scaleFactor = await homeWindow.scaleFactor();
        let logicalPosition = new PhysicalPosition(position.x, position.y).toLogical(scaleFactor);
        logicalPosition = new PhysicalPosition(logicalPosition.x, logicalPosition.y).toLogical(scaleFactor);
        logicalPosition.y = logicalPosition.y - height
        await trayWindow.setPosition(logicalPosition)
        await trayWindow.show()
        await trayWindow.setFocus()
    }
})
export default function CreateTrayWindow() {
    let webview = new WebviewWindow("tray_menu", {
        url: "/tray",
        width: width,
        height: height,
        alwaysOnTop: true,
        skipTaskbar: true,
        decorations: false,
        focus: false,
        center: true,
        transparent: true,
        resizable: false,
        shadow: false

    });
    webview.listen("tauri://blur", function () {
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
    webview.once("tauri://webview-created", function () {
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
}