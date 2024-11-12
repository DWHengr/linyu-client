import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import CustomInput from "../../../componets/CustomInput/index.jsx";
import CustomButton from "../../../componets/CustomButton/index.jsx";
import {getLocalItem, setLocalItem} from "../../../utils/storage.js";
import {useEffect, useState} from "react";
import {useHistory} from "react-router-dom";
import {useToast} from "../../../componets/CustomToast/index.jsx";

export default function LoginSet() {

    const h = useHistory();
    const [serverIp, setServerIp] = useState("")
    const [serverWs, setServerWs] = useState("")
    const showToast = useToast();

    useEffect(() => {
        let ip = getLocalItem("serverIp")
        let ws = getLocalItem("serverWs")
        setServerIp(ip ? ip : "http://127.0.0.1:9200")
        setServerWs(ws ? ws : "ws://127.0.0.1:9100")
    }, [])

    return (
        <CustomDragDiv style={{
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
                <CustomButton width={70}
                              onClick={() => {
                                  setLocalItem("serverIp", serverIp)
                                  setLocalItem("serverWs", serverWs)
                                  showToast("设置成功~")
                              }}
                >
                    确定
                </CustomButton>
                <CustomButton type="minor" width={70}
                              onClick={() => h.push('/login/account')}
                >
                    取消
                </CustomButton>
            </div>
        </CustomDragDiv>
    )
}