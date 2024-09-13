import "./index.less";
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import CustomInput from "../../componets/CustomInput/index.jsx";
import {useState, useEffect} from "react";
import CustomButton from "../../componets/CustomButton/index.jsx";
import {useToast} from "../../componets/CustomToast/index.jsx";
import UserApi from "../../api/user.js";
import LoginApi from "../../api/login.js";
import {JSEncrypt} from "jsencrypt";
import CustomBox from "../../componets/CustomBox/index.jsx";

export default function Register() {
    const [userInfo, setUserInfo] = useState({username: "", account: "", password: "", email: "", code: ""});
    const showToast = useToast();
    const [isSendEmailVerification, setIsSendEmailVerification] = useState(false);
    const [timer, setTimer] = useState(0); // 倒计时状态

    // 倒计时的副作用
    useEffect(() => {
        if (timer === 0) {
            setIsSendEmailVerification(false); // 重置按钮状态
        }

        // 如果 timer 大于 0，启动定时器
        if (timer > 0) {
            const intervalId = setInterval(() => {
                setTimer((prevTimer) => prevTimer - 1);
            }, 1000);

            // 清理定时器
            return () => clearInterval(intervalId);
        }
    }, [timer]);

    const onRegister = async () => {
        console.log(userInfo)
        if (!userInfo.username || !userInfo.account || !userInfo.password || !userInfo.email || !userInfo.code) {
            showToast("注册信息有误，请检查~", true);
            return;
        }
        let keyData = await LoginApi.publicKey();
        if (keyData.code !== 0) {
            return;
        }
        const encrypt = new JSEncrypt();
        encrypt.setPublicKey(keyData.data);
        UserApi.register({...userInfo, password: encrypt.encrypt(userInfo.password)}).then((res) => {
            if (res.code === 0) {
                showToast("注册成功~");
                setUserInfo({username: "", account: "", password: "", email: "", code: ""});
                setIsSendEmailVerification(false);
            } else {
                showToast(res.msg, true);
            }
        });
    };

    const onSendEmailVerification = () => {
        if (!userInfo.email) {
            showToast("邮箱不能为空~", true);
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(userInfo.email)) {
            showToast("请输入有效的邮箱地址~", true);
            return;
        }
        UserApi.emailVerification({email: userInfo.email}).then((res) => {
            if (res.code === 0) {
                showToast("发送成功，请及时查看~");
                setIsSendEmailVerification(true);
                setTimer(60); // 启动 60 秒倒计时
            } else {
                showToast(res.msg, true);
            }
        });
    };

    return (
        <CustomBox>
            <WindowOperation hide={false} height={40} isMaximize={false}/>
            <CustomDragDiv className="register">
                <div style={{width: 300, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <div style={{fontSize: 24, marginBottom: 50, fontWeight: 600}}>欢迎注册</div>
                    <div style={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        width: "100%"
                    }}>
                        <CustomInput
                            placeholder="用户名"
                            limit={30}
                            required={true}
                            requiredMsg="用户名不能为空"
                            value={userInfo.username}
                            onChange={(v) => setUserInfo({...userInfo, username: v})}
                        />
                        <CustomInput
                            placeholder="账号"
                            limit={30}
                            required={true}
                            requiredMsg="账号不能为空"
                            value={userInfo.account}
                            onChange={(v) => setUserInfo({...userInfo, account: v})}
                        />
                        <CustomInput
                            placeholder="密码"
                            limit={16}
                            required={true}
                            requiredMsg="密码不能为空"
                            type="password"
                            value={userInfo.password}
                            onChange={(v) => setUserInfo({...userInfo, password: v})}
                        />
                        <CustomInput
                            placeholder="邮箱"
                            required={true}
                            requiredMsg="邮箱不能为空"
                            value={userInfo.email}
                            onChange={(v) => setUserInfo({...userInfo, email: v})}
                        />
                        <div style={{display: "flex"}}>
                            <CustomInput
                                placeholder="邮箱验证码"
                                required={true}
                                value={userInfo.code}
                                type='text'
                                requiredMsg="验证码不能为空"
                                onChange={(v) => setUserInfo({...userInfo, code: v})}
                            />
                            <div style={{display: "flex", flexShrink: 0, height: 32, marginLeft: 5}}>
                                <CustomButton width={100} onClick={onSendEmailVerification}
                                              disabled={isSendEmailVerification}>
                                    {isSendEmailVerification ? `已发送(${timer})` : "发送验证码"}
                                </CustomButton>
                            </div>
                        </div>
                    </div>

                    <div style={{display: "flex", marginTop: 20}}>
                        <CustomButton width={140} onClick={onRegister}>
                            立即注册
                        </CustomButton>
                    </div>
                </div>
            </CustomDragDiv>
        </CustomBox>
    );
}
