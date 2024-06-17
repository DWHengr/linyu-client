import "./index.less"
import IconButton from "../IconButton/index.jsx";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";

export default function WindowOperation({hide = true, onClose, onMinimize, onHide}) {

    const handleMinimize = () => {
        if (onMinimize) {
            onMinimize()
        }
        WebviewWindow.getCurrent().minimize()
    }

    const handleClose = () => {
        if (onClose) {
            onClose()
        } else {
            WebviewWindow.getCurrent().close()
        }
    }

    const handleHide = () => {
        if (onHide) {
            onMinimize()
        }
        WebviewWindow.getCurrent().hide()
    }

    return (
        <div className="window-operation">
            <IconButton
                icon={<i className={`iconfont icon-zuixiaohua`} style={{fontSize: 22}}/>}
                onClick={handleMinimize}
            />
            <IconButton
                danger
                icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 22}}/>}
                onClick={hide ? handleHide : handleClose}
            />
        </div>
    )
}