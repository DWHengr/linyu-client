import "./index.less"
import {useEffect, useRef, useState} from "react";

export default function RightClickMenu({position, options, visible = false, onMenuItemClick}) {
    const [menuVisible, setMenuVisible] = useState(visible);
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const menuRef = useRef(null);

    useEffect(() => {
        if (!position) return
        setMenuVisible(true);
    }, [position])

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
                        {options.map((item, index) => (
                            <div className="option" key={index} onClick={(e) => {
                                onItemClick(item)
                            }}>
                                {item.label}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}