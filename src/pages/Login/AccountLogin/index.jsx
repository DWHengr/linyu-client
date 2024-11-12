import CustomUserNameInput from "../../../componets/CustomUserNameInput/index.jsx";
import CustomPwdInput from "../../../componets/CustomPwdInput/index.jsx";
import CreateForgetWindow from "../../ForgetPassword/window.jsx";
import CreateRegisterWindow from "../../Register/window.jsx";
import {getLocalItem, setLocalItem} from "../../../utils/storage.js";
import LoginApi from "../../../api/login.js";
import {JSEncrypt} from "jsencrypt";
import {invoke} from "@tauri-apps/api/core";
import CreateHomeWindow from "../../Home/window.jsx";
import {useEffect, useState} from "react";
import {useToast} from "../../../componets/CustomToast/index.jsx";
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import {useHistory} from "react-router-dom";

export default function AccountLogin() {

    let [account, setAccount] = useState("")
    let [password, setPassword] = useState("")
    const showToast = useToast();
    const [reagents, setReagents] = useState([])
    const [logging, setLogging] = useState(false)
    const h = useHistory();

    const handlerDeleteItem = (item) => {
        let newReagents = reagents.filter((v) => {
            return v !== item
        });
        setLocalItem("reagents", newReagents)
        setReagents(newReagents)
    }

    const onLogin = async () => {
        setLogging(true)
        if (!account) {
            showToast("用户名不能为空~", true)
            return
        }
        if (!password) {
            showToast("密码不能为空~", true)
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
            }).finally(() => {
            setLogging(false)
        })
    }


    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            onLogin()
        }
    }


    useEffect(() => {
        try {
            let data = getLocalItem("reagents")
            if (data) {
                setReagents(data)
            }
        } catch (e) {
        }
    }, [])


    return (
        <CustomDragDiv style={{display: "flex", flexDirection: "column", alignItems: "center"}}>
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
                <CustomPwdInput
                    value={password}
                    onChange={(v) => setPassword(v)}
                    onKeyDown={handleKeyDown}
                />
            </div>
            <div
                style={{
                    fontSize: 14,
                    cursor: "pointer",
                    color: "#a2a2a2",
                    display: "flex",
                    justifyContent: "end",
                    width: 255
                }}
                onClick={CreateForgetWindow}
            >
                忘记密码?
            </div>
            <div className={`login-button ${password && account && !logging ? "" : "disabled"}`}
                 onClick={() => {
                     if (password && account)
                         onLogin()
                 }}
            >
                {!logging ? <span>登 录</span> :
                    <span className="dots">
                         登 录 中
                        </span>
                }
            </div>
            <div style={{display: "flex", marginTop: 15}}>
                <div
                    style={{fontSize: 14, cursor: "pointer", color: "#4C9BFF", marginRight: 15}}
                    onClick={() => h.push('/login/qr')}
                >
                    扫码登录
                </div>
                <div
                    style={{fontSize: 14, cursor: "pointer", color: "#4C9BFF"}}
                    onClick={CreateRegisterWindow}
                >
                    注册账号
                </div>
            </div>
        </CustomDragDiv>
    )

}