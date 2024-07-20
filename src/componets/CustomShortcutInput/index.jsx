import React, {useState, useRef, useEffect} from 'react';
import "./index.less"
import {isValidShortcut} from "../../utils/shortcut.js";

const CustomShortcutInput = ({value, onChange}) => {
    const [shortcut, setShortcut] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentKeys, setCurrentKeys] = useState(new Set());
    const inputRef = useRef(null);

    useEffect(() => {
        setShortcut(value)
    }, [value])

    useEffect(() => {
        if (isEditing) {
            inputRef.current.focus();
            window.addEventListener('keydown', handleKeyDown);
            window.addEventListener('keyup', handleKeyUp);
        } else {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, [isEditing]);

    const handleKeyDown = (e) => {
        e.preventDefault();
        const key = e.key;
        setCurrentKeys(prev => new Set(prev).add(key));
    };

    const handleKeyUp = (e) => {
        const key = e.key;
        setCurrentKeys(prev => {
            const updated = new Set(prev);
            return updated;
        });
    };

    const normalizeKey = (key) => {
        const specialKeys = {
            ' ': 'Space',
            'Control': 'Ctrl',
            'Meta': 'Command',
        };
        return specialKeys[key] || key.charAt(0).toUpperCase() + key.slice(1);
    };

    const formatShortcut = (keys) => {
        return Array.from(keys).map(normalizeKey).join(' + ');
    };

    const handleInputBlur = () => {
        let shortcutStr = formatShortcut(currentKeys);
        if (currentKeys.size > 0 && isValidShortcut(shortcutStr)) {
            setShortcut(shortcutStr);
            if (onChange) onChange(shortcutStr)
        } else {
            setShortcut(value);
        }
        setIsEditing(false);
        setCurrentKeys(new Set());
    };

    const handleClick = () => {
        if (!isEditing) {
            setIsEditing(true);
        }
    };

    const handleClear = (e) => {
        e.stopPropagation();
        setShortcut('');
        setIsEditing(false);
        setCurrentKeys(new Set());
    };

    const onClear = () => {
        if (onChange) onChange('')
    }

    return (
        <div
            onClick={handleClick}
            onBlur={handleInputBlur}
            className={`shortcut-input-container ${isEditing ? "edit" : ""}`}
        >
            {isEditing ? (
                <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
                    <input
                        ref={inputRef}
                        type="text"
                        value={currentKeys.size > 0 ? formatShortcut(currentKeys) : '请按下快捷键'}
                        readOnly
                        style={{border: 'none', outline: 'none', width: '100%'}}
                    />
                    <div onClick={handleClear}
                         style={{background: 'none', border: 'none', cursor: 'pointer', color: "#969696"}}>
                        <i
                            className={`iconfont icon-guanbi operation-icon`}
                        />
                    </div>
                </div>
            ) : shortcut ? (
                <div style={{display: "flex", width: "100%", justifyContent: "space-between", alignItems: "center"}}>
                    <div>{shortcut}</div>
                    <div onClick={onClear}
                         style={{background: 'none', border: 'none', cursor: 'pointer', color: "#969696"}}>
                        <i
                            className={`iconfont icon-guanbi operation-icon`}
                        />
                    </div>
                </div>
            ) : (
                <div style={{color: "#969696"}}>点击设置快捷键</div>
            )}
        </div>
    );
};

export default CustomShortcutInput;