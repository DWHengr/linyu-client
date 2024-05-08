import "./index.less"
import {appWindow, WebviewWindow} from "@tauri-apps/api/window";
import CustomUserNameInput from "../../componets/CustomUserNameInput/index.jsx";
import CustomPwdInput from "../../componets/CustomPwdInput/index.jsx";

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
        <div className="login-container">
            <div data-tauri-drag-region className="login">
                <div className="login-operate">
                    <i className={`iconfont icon-guanbi`} style={{fontSize: 25}}/>
                </div>
                <div className="login-icon">
                    <img style={{height: 120}} src="/logo.png" alt=""/>
                </div>
                <div className="login-pwd-input">
                    <CustomUserNameInput/>
                </div>
                <div className="login-pwd-input">
                    <CustomPwdInput/>
                </div>
                <div className="login-button" onClick={onLogin}>登 录</div>
            </div>
        </div>
    )
}