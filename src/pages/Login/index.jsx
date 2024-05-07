import {appWindow, WebviewWindow} from "@tauri-apps/api/window";

export default function Login() {

    const onLogin = () => {
        let webview = new WebviewWindow("home", {
            url: "/home",
            center: true,
            width: 1010,
            minWidth: 810,
            height: 750,
            minHeight: 600,
            decorations: false,
            transparent: true
        });

        webview.once("tauri://created", function () {
            appWindow?.close();
        });
    }

    return (
        <>
            <div>
                <button onClick={onLogin}>login</button>
            </div>
        </>
    )
}