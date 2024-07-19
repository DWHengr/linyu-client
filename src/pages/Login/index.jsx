import "./index.less"
import CustomUserNameInput from "../../componets/CustomUserNameInput/index.jsx";
import CustomPwdInput from "../../componets/CustomPwdInput/index.jsx";
import IconButton from "../../componets/IconButton/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import LoginApi from "../../api/login.js";
import {useEffect, useState} from "react";
import CreateHomeWindow from "../Home/window.jsx";
import {invoke} from "@tauri-apps/api/core";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import {useToast} from "../../componets/CustomToast/index.jsx";
import {getLocalItem, setLocalItem} from "../../utils/storage.js";

export default function Login() {
    let [account, setAccount] = useState("")
    let [password, setPassword] = useState("")
    const showToast = useToast();
    const [reagents, setReagents] = useState([])

    useEffect(() => {
        try {
            let data = getLocalItem("reagents")
            if (data) {
                setReagents(data)
            }
        } catch (e) {
        }
    }, [])

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
                    let data = getLocalItem("reagents")
                    data = new Set(data)
                    data.add(account)
                    setLocalItem("reagents", [...data])
                } else {
                    showToast(res.msg, true)
                }
            })
            .catch((res) => {
                showToast(res.message, true)
            })
    }

    const handlerDeleteItem = (item) => {
        let newReagents = reagents.filter((v) => {
            return v !== item
        });
        setLocalItem("reagents", newReagents)
        setReagents(newReagents)
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
                        reagents={reagents}
                        onDeleteItem={handlerDeleteItem}
                    />
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