import React, {useState, useRef, useEffect} from 'react';
import "./index.less"

const CustomShortcutInput = () => {
    const [shortcut, setShortcut] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentKeys, setCurrentKeys] = useState(new Set());
    const inputRef = useRef(null);

    const functionKeys = new Set(['Control', 'Alt', 'Shift', 'Meta']);

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

    const isValidShortcut = (keys) => {
        return Array.from(keys).some(key => !functionKeys.has(key));
    };

    const formatShortcut = (keys) => {
        return Array.from(keys).map(normalizeKey).join(' + ');
    };

    const handleInputBlur = () => {
        if (currentKeys.size > 0 && isValidShortcut(currentKeys)) {
            setShortcut(formatShortcut(currentKeys));
        } else {
            setShortcut('');
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

    return (
        <div
            onClick={handleClick}
            onBlur={handleInputBlur}
            className={`shortcut-input-container ${isEditing ? "edit" : ""}`}
        >
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={currentKeys.size > 0 ? formatShortcut(currentKeys) : '请按下快捷键'}
                    readOnly
                    style={{border: 'none', outline: 'none', width: '100%'}}
                />
            ) : shortcut ? (
                <div>{shortcut}</div>
            ) : (
                <div style={{color: "#969696"}}>点击设置快捷键</div>
            )}
            <button onClick={handleClear}
                    style={{background: 'none', border: 'none', cursor: 'pointer', color: "#969696"}}>
                ✖
            </button>
        </div>
    );
};

export default CustomShortcutInput;