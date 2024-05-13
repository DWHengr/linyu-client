import "./index.less"
import {appWindow} from "@tauri-apps/api/window";
import CustomUserNameInput from "../../componets/CustomUserNameInput/index.jsx";
import CustomPwdInput from "../../componets/CustomPwdInput/index.jsx";
import IconButton from "../../componets/IconButton/index.jsx";
import CreateHomeWindow from "../Home/window.jsx";

export default function Login() {

    const onLogin = () => {
        CreateHomeWindow()
    }

    return (
        <div className="login-container">
            <div className="login">
                <div data-tauri-drag-region className="login-drag"></div>
                <div className="login-operate">
                    <IconButton
                        danger
                        icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 22}}/>}
                        onClick={
                            () => appWindow.close()
                        }
                    />
                </div>
                <div className="login-icon">
                    <img style={{height: 120}} src="/logo.png" alt=""/>
                </div>
                <div className="login-pwd-input">
                    <CustomUserNameInput
                        reagents={["admin", "xiaohong", "xiaohong", "xiaohong", "xiaohong", "xiaohong", "xiaohong", "xiaohong"]}/>
                </div>
                <div className="login-pwd-input">
                    <CustomPwdInput/>
                </div>
                <div className="login-button" onClick={onLogin}>登 录</div>
            </div>
        </div>
    )
}