import "./index.less"
import {useEffect, useState} from "react";
import {WebviewWindow} from "@tauri-apps/api/webviewWindow";
import CustomDragDiv from "../CustomDragDiv/index.jsx";

export default function CustomBox({children, className}) {
    let [isFull, setIsFull] = useState(false)
    useEffect(() => {
        const window = WebviewWindow.getCurrent()
        let unResize = window.listen("tauri://resize", async function (e) {
            let isFull = await window.isMaximized()
            setIsFull(isFull)
        });
        return async () => {
            (await unResize)();
        }
    })
    return (
        <div className={`custom-box-container ${isFull ? 'full' : ''}`}>
            <CustomDragDiv className={`custom-box ${className}`}>
                {children}
            </CustomDragDiv>
        </div>
    )
}