import "./index.less"
import {useEffect, useRef, useState} from "react";
import {listen} from "@tauri-apps/api/event";
import RightClickContent from "../RightClickContent/index.jsx";

export default function RightClickMenu({position, options, visible = false, onMenuItemClick, filter = [], width}) {
    const [menuVisible, setMenuVisible] = useState();
    const [menuPosition, setMenuPosition] = useState({x: 0, y: 0});
    const menuRef = useRef(null);
    const [menuOptions, setMenuOption] = useState(options)

    useEffect(() => {
        if (!filter || filter.length <= 0) return
        let ops = options.filter((option) => {
            return !filter.includes(option.key)
        })
        setMenuOption(ops)
    }, [filter])

    const onItemClick = (action) => {
        setMenuVisible({value: false})
        if (onMenuItemClick) onMenuItemClick(action)
    }

    return (
        <>
            <RightClickContent visible={menuVisible} position={position}>
                <div className="options" style={{width: width}}>
                    {menuOptions.map((item, index) => {
                        if (filter.includes(index.key)) {
                            return <></>
                        }
                        return (
                            <div className="option" key={item.key} onMouseDown={(e) => {
                                if (e.button === 0) {
                                    onItemClick(item)
                                }
                            }}>
                                {item.label}
                            </div>
                        )
                    })}
                </div>
            </RightClickContent>
        </>
    )
}