import "./index.less"
import {useEffect, useRef, useState} from "react";
import {listen} from "@tauri-apps/api/event";

export default function RightClickMenu({position, options, visible = false, onMenuItemClick, filter = []}) {
    const [menuVisible, setMenuVisible] = useState(visible);
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const menuRef = useRef(null);
    const [menuOptions, setMenuOption] = useState(options)

    useEffect(() => {
        if (!position) return
        setMenuVisible(true);
    }, [position])

    useEffect(() => {
        const unListen = listen('drag-click', (event) => {
            setMenuVisible(false)
        });
        return async () => {
            (await unListen)()
        }
    }, [])

    useEffect(() => {
        if (!filter || filter.length <= 0) return
        let ops = options.filter((option) => {
            return !filter.includes(option.key)
        })
        setMenuOption(ops)
    }, [filter])

    useEffect(() => {
        if (menuVisible) {
            if (position.y + menuRef.current.clientHeight > window.innerHeight - 20) {
                position.y = position.y - menuRef.current.clientHeight
            }
            if (position.x + menuRef.current.clientWidth > window.innerWidth - 20) {
                position.x = position.x - menuRef.current.clientWidth
            }
            setMenuPosition(position);
            menuRef.current.focus()
        }
    }, [menuVisible])

    useEffect(() => {
        if (menuVisible) setMenuVisible(false);
    }, [visible])

    const onItemClick = (action) => {
        setMenuVisible(false)
        if (onMenuItemClick) onMenuItemClick(action)
    };

    return (
        <div className="right-click-menu">
            {menuVisible && (
                <div className="overlay">
                    <div
                        ref={menuRef}
                        style={{
                            top: menuPosition.y,
                            left: menuPosition.x,
                        }}
                        className="options"
                        tabIndex="0"
                        onBlur={() => setMenuVisible(false)}
                    >
                        {menuOptions.map((item, index) => {
                            if (filter.includes(index.key)) {
                                return <></>
                            }
                            return (
                                <div className="option" key={item.key} onClick={(e) => {
                                    onItemClick(item)
                                }}>
                                    {item.label}
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}