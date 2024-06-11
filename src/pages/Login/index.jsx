import "./index.less"
import CustomUserNameInput from "../../componets/CustomUserNameInput/index.jsx";
import CustomPwdInput from "../../componets/CustomPwdInput/index.jsx";
import IconButton from "../../componets/IconButton/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import LoginApi from "../../api/login.js";
import {useState} from "react";
import CreateHomeWindow from "../Home/window.jsx";
import {invoke} from "@tauri-apps/api/core";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import {useToast} from "../../componets/CustomToast/index.jsx";

export default function Login() {
    let [account, setAccount] = useState("")
    let [password, setPassword] = useState("")
    var showToast = useToast();
    const onLogin = () => {
        if (!account) {
            showToast("用户名不能为空~", true)
            return
        }
        if (!password) {
            showToast("用户名不能为空~", true)
            return
        }
        LoginApi.login({account: account, password: password})
            .then((res) => {
                if (res.code === 0) {
                    invoke('save_user_info', {
                        userid: res.data.userId,
                        username: res.data.username,
                        token: res.data.token,
                        portrait: res.data.portrait,
                    }).then(() => {
                        CreateHomeWindow()
                    })
                } else {
                    showToast(res.msg, true)
                }
            })
            .catch((res) => {
                showToast(res.message, true)
            })
    }

    return (
        <div className="login-container">
            <CustomDragDiv className="login">
                <div className="login-operate">
                    <IconButton
                        danger
                        icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 22}}/>}
                        onClick={
                            () => {
                                const appWindow = WebviewWindow.getByLabel('login')
                                appWindow.close()
                            }
                        }
                    />
                </div>
                <div className="login-icon">
                    <img style={{height: 120}} src="/logo.png" alt=""/>
                </div>
                <div className="login-pwd-input">
                    <CustomUserNameInput
                        value={account}
                        onChange={(v) => setAccount(v)}
                        reagents={["admin", "xiaohong", "xiaohong", "xiaohong", "xiaohong", "xiaohong", "xiaohong", "xiaohong"]}/>
                </div>
                <div className="login-pwd-input">
                    <CustomPwdInput value={password} onChange={(v) => setPassword(v)}/>
                </div>
                <div className={`login-button ${password && account ? "" : "disabled"}`} onClick={() => {
                    if (password && account)
                        onLogin()
                }}>
                    登 录
                </div>
            </CustomDragDiv>
        </div>
    )
}