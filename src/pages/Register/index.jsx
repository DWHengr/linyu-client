import "./index.less"
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import CustomInput from "../../componets/CustomInput/index.jsx";
import {useState} from "react";
import CustomButton from "../../componets/CustomButton/index.jsx";
import {useToast} from "../../componets/CustomToast/index.jsx";
import UserApi from "../../api/user.js";

export default function Register() {
    const [userInfo, setUserInfo] = useState({username: "", account: "", password: ""})
    const showToast = useToast()

    const onRegister = () => {
        if (!userInfo.username || !userInfo.account || !userInfo.password) {
            showToast("注册信息有误，请检查~", true)
            return
        }
        UserApi.register(userInfo).then(res => {
            if (res.code === 0) {
                showToast("注册成功~")
                setUserInfo({username: "", account: "", password: ""})
            } else {
                showToast(res.msg, true)
            }
        })
    }

    return (
        <CustomDragDiv className="register-container">
            <WindowOperation
                hide={false}
                height={40}
                isMaximize={false}
            />
            <CustomDragDiv className="register">
                <div style={{width: 260, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <div style={{fontSize: 24, marginBottom: 50, fontWeight: 600}}>欢迎注册</div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%"
                    }}>
                        <CustomInput
                            placeholder="用户名"
                            limit={30} required={true}
                            requiredMsg="用户名不能为空"
                            value={userInfo.username}
                            onChange={(v) => setUserInfo({...userInfo, "username": v})}
                        />
                        <CustomInput
                            placeholder="账号"
                            limit={30}
                            required={true}
                            requiredMsg="账号不能为空"
                            value={userInfo.account}
                            onChange={(v) => setUserInfo({...userInfo, "account": v})}
                        />
                        <CustomInput
                            placeholder="密码"
                            limit={16}
                            required={true}
                            requiredMsg="密码不能为空"
                            type="password"
                            value={userInfo.password}
                            onChange={(v) => setUserInfo({...userInfo, "password": v})}
                        />
                    </div>

                    <div style={{display: "flex", marginTop: 50}}>
                        <CustomButton width={140} onClick={onRegister}>
                            立即注册
                        </CustomButton>
                    </div>
                </div>

            </CustomDragDiv>
        </CustomDragDiv>
    )

}