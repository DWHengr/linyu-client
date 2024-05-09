import {appWindow, LogicalSize, PhysicalPosition, WebviewWindow} from "@tauri-apps/api/window";
import {listen} from "@tauri-apps/api/event";


let width = 120
let height = 160

await listen('tray_menu', async (event) => {
    const homeWindow = WebviewWindow.getByLabel('home')
    if (!homeWindow) return
    let position = event.payload[0];
    const trayWindow = WebviewWindow.getByLabel('tray_menu')
    if (trayWindow) {
        let scaleFactor = await appWindow.scaleFactor();
        let logicalPosition = new PhysicalPosition(position.x, position.y).toLogical(scaleFactor);
        logicalPosition.y = logicalPosition.y - height
        await trayWindow.setPosition(logicalPosition)
        await trayWindow.show()
        await trayWindow.setFocus()
    }
})
export default function CreateTrayWindow(position) {

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
        resizable: false

    });
    webview.listen("tauri://blur", function () {
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
    webview.once("tauri://created", function () {
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        trayWindow.hide();
    });
}