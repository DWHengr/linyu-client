import "./index.less"
import {appWindow} from "@tauri-apps/api/window";
import CustomUserNameInput from "../../componets/CustomUserNameInput/index.jsx";
import CustomPwdInput from "../../componets/CustomPwdInput/index.jsx";
import IconButton from "../../componets/IconButton/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import LoginApi from "../../api/login.js";
import {useState} from "react";
import CreateHomeWindow from "../Home/window.jsx";

export default function Login() {
    let [account, setAccount] = useState("")
    let [password, setPassword] = useState("")
    const onLogin = () => {
        if (!account) {
            console.log("用户名不能为空")
            return
        }
        if (!password) {
            console.log("密码不能为空")
            return
        }
        LoginApi.login({account: account, password: password})
            .then((res) => {
                if (res.code === 0) {
                    localStorage.setItem("token", res.data.token)
                    localStorage.setItem("userId", res.data.userId)
                    localStorage.setItem("account", res.data.account)
                    localStorage.setItem("username", res.data.username)
                    CreateHomeWindow()
                } else {
                    console.log(res.msg)
                }
            })
            .catch((res) => {
                console.log(res.message)
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
                            () => appWindow.close()
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
                <div className="login-button" onClick={onLogin}>登 录</div>
            </CustomDragDiv>
        </div>
    )
}