import "./index.less"
import {exit} from "@tauri-apps/plugin-process";
import CustomLine from "../../componets/CustomLine/index.jsx";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";

export default function TrayMenu() {
    const [userInfo, setUserInfo] = useState("");

    useEffect(() => {
        (async () => {
            let userInfo = await invoke("get_user_info", {})
            setUserInfo(userInfo)
        })()
    }, [])

    const onShowHome = async () => {
        const homeWindow = WebviewWindow.getByLabel('home')
        await homeWindow.show()
        await homeWindow.unminimize()
        await homeWindow.setFocus()
        const trayWindow = WebviewWindow.getByLabel('tray_menu')
        await trayWindow.hide()
    }

    const onQuit = () => {
        exit()
    }

    return (
        <div className="tray-menu-container">
            <div className="tray-menu">
                <img
                    className="tray-menu-portrait"
                    style={{width: 60, height: 60, borderRadius: 60,}}
                    src={userInfo.portrait}
                    alt={userInfo.portrait}/>
                <div style={{fontSize: 12, fontWeight: 600}}>
                    {userInfo.username}
                </div>
                <CustomLine width={1}/>
                <div className="tray-menu-operation">
                    <div className="tray-menu-operation-item" onClick={onShowHome}>
                        <i className={`iconfont icon-zhuye`} style={{fontSize: 16, marginRight: 5}}/>
                        打开主页面
                    </div>
                    <div className="tray-menu-operation-item" onClick={onQuit}>
                        <i className={`iconfont icon-logout`} style={{fontSize: 16, marginRight: 5}}/>
                        退出
                    </div>
                </div>
            </div>
        </div>
    )
}