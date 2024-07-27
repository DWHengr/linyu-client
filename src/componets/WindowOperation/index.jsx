import "./index.less"
import IconButton from "../IconButton/index.jsx";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import {useEffect, useState} from "react";

export default function WindowOperation({hide = true, onClose, onMinimize, onHide, height, isMaximize = true}) {

    const [isMax, setIsMax] = useState(false)

    useEffect(() => {
        let window = WebviewWindow.getCurrent();
        let UnlistenFn = window.listen("tauri://resize", async function () {
            setIsMax(await window.isMaximized())
        });
        return async () => {
            (await UnlistenFn)();
        }
    }, [])

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

    const handleMaximize = () => {
        if (onHide) {
            onMinimize()
        }
        WebviewWindow.getCurrent().maximize()
    }

    const handleUnMaximize = () => {
        if (onHide) {
            onMinimize()
        }
        WebviewWindow.getCurrent().unmaximize()
    }

    return (
        <div className="window-operation" style={{height: height}}>
            <IconButton
                icon={<i className={`iconfont icon-zuixiaohua`} style={{fontSize: 22}}/>}
                onClick={handleMinimize}
            />
            {
                isMaximize && <IconButton
                    icon={<i className={`iconfont ${isMax ? "icon-chuangkouhua" : "icon-zuidahua"}`}
                             style={{fontSize: 18}}/>}
                    onClick={isMax ? handleUnMaximize : handleMaximize}
                />
            }
            <IconButton
                danger
                icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 22}}/>}
                onClick={hide ? handleHide : handleClose}
            />
        </div>
    )
}