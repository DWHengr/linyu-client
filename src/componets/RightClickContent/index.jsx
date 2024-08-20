import "./index.less"
import {useEffect, useRef, useState} from "react";
import {listen} from "@tauri-apps/api/event";

export default function RightClickContent({position, visible, children}) {
    const [contentVisible, setContentVisible] = useState();
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const menuRef = useRef(null);

    useEffect(() => {
        if (!position) return
        setContentVisible(true);
    }, [position])

    useEffect(() => {
        setContentVisible(visible?.value);
    }, [visible])

    useEffect(() => {
        const unListen = listen('drag-click', (event) => {
            setContentVisible(false)
        });
        return async () => {
            (await unListen)()
        }
    }, [])

    useEffect(() => {
        if (contentVisible) {
            if (position.y + menuRef.current.clientHeight > window.innerHeight - 20) {
                position.y = position.y - menuRef.current.clientHeight
            }
            if (position.x + menuRef.current.clientWidth > window.innerWidth - 20) {
                position.x = position.x - menuRef.current.clientWidth
            }
            setMenuPosition(position);
            menuRef.current.focus()
        }
    }, [contentVisible])

    return (
        <div className="right-click-content">
            {contentVisible && (
                <div className="overlay">
                    <div
                        ref={menuRef}
                        style={{
                            top: menuPosition.y,
                            left: menuPosition.x,
                        }}
                        className="content"
                        tabIndex="0"
                        onBlur={() => setContentVisible(false)}
                    >
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}