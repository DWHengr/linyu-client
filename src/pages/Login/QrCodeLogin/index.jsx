import './index.less'
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import QRCodeGenerator from "../../../componets/QRCodeGenerator/index.jsx";
import CreateRegisterWindow from "../../Register/window.jsx";
import {useHistory} from "react-router-dom";
import QrApi from "../../../api/qr.js";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import CreateHomeWindow from "../../Home/window.jsx";
import CustomButton from "../../../componets/CustomButton/index.jsx";

export default function QrCodeLogin() {
    const h = useHistory();
    const [qrCode, setQrCode] = useState('');
    const [qrResult, setQrResult] = useState(null);
    const [qrExpired, setQrExpired] = useState(false);
    const [countdown, setCountdown] = useState(60);

    useEffect(() => {
        onGetQrCode();
    }, []);

    useEffect(() => {
        let timer;
        if (!qrExpired) {
            timer = setInterval(() => {
                onGetQrCodeResult();
                setCountdown(prev => {
                    if (prev <= 1) {
                        clearInterval(timer);
                        setQrExpired(true);
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        }
        return () => {
            if (timer) clearInterval(timer);
        };
    }, [qrCode, qrExpired]);

    const onGetQrCode = () => {
        QrApi.code().then(res => {
            if (res.code === 0) {
                setQrCode(res.data);
                setQrExpired(false);
                setCountdown(60);
            }
        });
    }

    const onGetQrCodeResult = () => {
        QrApi.result({key: qrCode}).then(res => {
            if (res.code === 0) {
                if (res.data.status === 'success') {
                    invoke('save_user_info', {
                        userid: res.data.userInfo.userId,
                        username: res.data.userInfo.username,
                        token: res.data.userInfo.token,
                        portrait: res.data.userInfo.portrait,
                    }).then(() => {
                        CreateHomeWindow();
                    });
                }
            }
        });
    }

    return (
        <CustomDragDiv className="qr-code-login">
            <div style={{fontSize: 18, marginBottom: 20}}>请用手机linyu扫描登录</div>
            <div className="qr-code-content">
                {
                    qrExpired && <div className="qr-expired">
                        <div style={{textAlign: 'center'}}>
                            <div style={{marginBottom: 15, color: '#ff4c4c', fontSize: 16, fontWeight: 500}}>
                                当前二维码已失效
                            </div>
                            <CustomButton type="monir" onClick={onGetQrCode}>重新获取</CustomButton>
                        </div>
                    </div>
                }
                <QRCodeGenerator value={qrCode} size={150}></QRCodeGenerator>
            </div>
            <div style={{display: "flex", marginTop: 20}}>
                <div
                    style={{fontSize: 14, cursor: "pointer", color: "#4C9BFF", marginRight: 15}}
                    onClick={() => h.push('/login/account')}
                >
                    账号登录
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