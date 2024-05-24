import "./index.less"
import IconButton from "../IconButton/index.jsx";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";

export default function WindowOperation({hide = true}) {

    const onMinimize = () => {
        WebviewWindow.getCurrent().minimize()
    }

    const onClose = () => {
        WebviewWindow.getCurrent().close()
    }

    const onHide = () => {
        WebviewWindow.getCurrent().hide()
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