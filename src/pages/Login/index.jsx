import "./index.less"
import IconButton from "../../componets/IconButton/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import {useEffect} from "react";
import CreateAboutWindow from "../AboutWindow/window.jsx";
import CustomBox from "../../componets/CustomBox/index.jsx";
import {exit} from "@tauri-apps/plugin-process";
import {getAllWindows} from "@tauri-apps/api/window";
import Ws from "../../utils/ws.js";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import AccountLogin from "./AccountLogin/index.jsx";
import QrCodeLogin from "./QrCodeLogin/index.jsx";
import LoginSet from "./LoginSet/index.jsx";

export default function Login() {

    const h = useHistory();

    useEffect(() => {
        (async () => {
            Ws.disconnect()
            let windows = await getAllWindows()
            windows?.map(w => {
                if (w.label !== 'login') {
                    w.close();
                }
            })
        })()
    })

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
                        onClick={() => h.push('/login/set')}
                    />
                    <IconButton
                        danger
                        icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 22}}/>}
                        onClick={exit}
                    />
                </div>
            </CustomDragDiv>
            <div style={{width: "100%", height: "100%"}}>
                <Switch>
                    <Route path="/login/account" component={AccountLogin}></Route>
                    <Route path="/login/set" component={LoginSet}></Route>
                    <Route path="/login/qr" component={QrCodeLogin}></Route>
                    <Redirect path="/login" to="/login/account"/>
                </Switch>
            </div>
        </CustomBox>
    )
}
