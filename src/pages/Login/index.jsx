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
import CreateAboutWindow from "../AboutWindow/window.jsx";
import CustomInput from "../../componets/CustomInput/index.jsx";
import CustomButton from "../../componets/CustomButton/index.jsx";
import CreateRegisterWindow from "../Register/window.jsx";
import {JSEncrypt} from "jsencrypt";
import CustomBox from "../../componets/CustomBox/index.jsx";

export default function Login() {
    let [account, setAccount] = useState("")
    let [password, setPassword] = useState("")
    const showToast = useToast();
    const [reagents, setReagents] = useState([])
    const [serverIp, setServerIp] = useState("")
    const [serverWs, setServerWs] = useState("")
    const [isSetServer, setIsSetServer] = useState(false)

    useEffect(() => {
        let ip = getLocalItem("serverIp")
        let ws = getLocalItem("serverWs")
        setServerIp(ip ? ip : "http://127.0.0.1:9200")
        setServerWs(ws ? ws : "ws://127.0.0.1:9100")
        try {
            let data = getLocalItem("reagents")
            if (data) {
                setReagents(data)
            }
        } catch (e) {
        }
    }, [])

    const onLogin = async () => {
        if (!account) {
            showToast("用户名不能为空~", true)
            return
        }
        if (!password) {
            showToast("用户名不能为空~", true)
            return
        }
        let keyData = await LoginApi.publicKey();
        if (keyData.code !== 0) {
            return
        }
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(keyData.data);
        const encryptedPassword = encrypt.encrypt(password);
        LoginApi.login({account: account, password: encryptedPassword})
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
        <CustomBox className="login">
            <CustomDragDiv className="login-operate">
                <div style={{marginLeft: 10}}>
                    <IconButton
                        icon={<i className={`iconfont icon-guanyu`} style={{fontSize: 22}}/>}
                        onClick={CreateAboutWindow}
                    />
                </div>
                <div style={{display: "flex", marginRight: 10}}>
                    <IconButton
                        icon={<i className={`iconfont icon-shezhi`} style={{fontSize: 22}}/>}
                        onClick={() => setIsSetServer(!isSetServer)}
                    />
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
            </CustomDragDiv>
            {!isSetServer && <div style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
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
                <div
                    style={{fontSize: 14, marginTop: 15, cursor: "pointer", color: "#4C9BFF"}}
                    onClick={CreateRegisterWindow}
                >
                    注册账号
                </div>
            </div>}
            {isSetServer &&
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    width: "100%",
                    userSelect: "none"
                }}>
                    <CustomDragDiv style={{marginTop: 36, fontSize: 20}}>设置服务器</CustomDragDiv>
                    <div style={{marginTop: 36, width: "85%"}}>
                        <div style={{marginBottom: 5, fontSize: 14}}>IP地址:</div>
                        <CustomInput value={serverIp} onChange={(v) => setServerIp(v)}/>
                    </div>
                    <div style={{marginTop: 20, width: "85%"}}>
                        <div style={{marginBottom: 5, fontSize: 14}}>WebSocket地址:</div>
                        <CustomInput value={serverWs} onChange={(v) => setServerWs(v)}/>
                    </div>
                    <div style={{display: "flex", marginTop: 50, width: "85%", justifyContent: "end"}}>
                        <CustomButton width={70} onClick={() => {
                            setLocalItem("serverIp", serverIp)
                            setLocalItem("serverWs", serverWs)
                            setIsSetServer(false)
                            showToast("设置成功~")
                        }}>
                            确定
                        </CustomButton>
                        <CustomButton type="minor" width={70}
                                      onClick={() => setIsSetServer(false)}
                        >
                            取消
                        </CustomButton>
                    </div>
                </div>}
        </CustomBox>
    )
}