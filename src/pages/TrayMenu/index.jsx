import "./index.less"
import {WebviewWindow} from "@tauri-apps/api/window";
import {exit} from "@tauri-apps/api/process";
import CustomLine from "../../componets/CustomLine/index.jsx";
import {useEffect, useState} from "react";
import {invoke} from "@tauri-apps/api/tauri";

export default function TrayMenu() {
    const [currentUsername, setCurrentUsername] = useState("");

    useEffect(() => {
        (async () => {
            let userInfo = await invoke("get_user_info", {})
            setCurrentUsername(userInfo.username)
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
                <div className="tray-menu-portrait"></div>
                <div style={{fontSize: 12, fontWeight: 600}}>
                    {currentUsername}
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