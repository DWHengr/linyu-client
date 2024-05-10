import "./index.less"
import {useEffect, useRef, useState} from "react";

export default function RightClickMenu({position, options, visible = false, onOptions,}) {
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
        }
    }, [menuVisible])

    useEffect(() => {
        if (menuVisible) setMenuVisible(false);
    }, [visible])

    const onMenuItemClick = (action) => {
        setMenuVisible(false);
    };

    useEffect(() => {
        const onDocumentClick = (e) => {
            if (menuVisible && !menuRef.current.contains(e.target)) {
                setMenuVisible(false);
            }
        };
        const handleDesktopClick = () => {
            setMenuVisible(false);
        };
        document.addEventListener('click', onDocumentClick);
        document.addEventListener('mousedown', handleDesktopClick);
        return () => {
            document.removeEventListener('click', onDocumentClick);
            document.addEventListener('mousedown', handleDesktopClick);
        };
    }, []);

    return (
        <div className="right-click-menu">
            {menuVisible && (
                <div
                    ref={menuRef}
                    style={{
                        top: menuPosition.y,
                        left: menuPosition.x,
                    }}
                    className="options"
                >
                    {options.map((item, index) => (
                        <div className="option" key={index} onClick={() => onMenuItemClick(item)}>
                            {item.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    )
}