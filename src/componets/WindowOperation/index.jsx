import "./index.less"
import IconButton from "../IconButton/index.jsx";
import {appWindow, WebviewWindow} from "@tauri-apps/api/window";

export default function WindowOperation({hide = true}) {

    const onMinimize = () => {
        WebviewWindow.getFocusedWindow().then((window) => {
            appWindow.minimize();
        })
    }

    const onClose = () => {
        WebviewWindow.getFocusedWindow().then((window) => {
            appWindow.close();
        })
    }

    const onHide = () => {
        WebviewWindow.getFocusedWindow().then((window) => {
            appWindow.hide();
        })
    }

    return (
        <div className="window-operation">
            <IconButton
                icon={<i className={`iconfont icon-zuixiaohua`} style={{fontSize: 22}}/>}
                onClick={onMinimize}
            />
            <IconButton
                danger
                icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 22}}/>}
                onClick={hide ? onHide : onClose}
            />
        </div>
    )
}