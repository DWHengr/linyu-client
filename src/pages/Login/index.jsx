import {appWindow, WebviewWindow} from "@tauri-apps/api/window";

export default function Login() {

    const onLogin = () => {
        let webview = new WebviewWindow("home", {
            url: "/home",
            center: true,
            width: 1000,
            minWidth: 800,
            height: 750,
            minHeight: 600,
            decorations: false,
            transparent: true
        });

        webview.once('tauri://error', function (e) {
            console.log(e)
        });

        webview.once("tauri://created", function () {
            appWindow?.close();
        });
        console.log(webview)
    }

    return (
        <>
            <div>
                <button onClick={onLogin}>login</button>
            </div>
        </>
    )
}