import {register, unregister} from "@tauri-apps/plugin-global-shortcut";
import {emit} from "@tauri-apps/api/event";

export function shortcutRegister(shortcut, handler) {
    register(shortcut, handler)
}

export function shortcutRegisterAndEmit(shortcut, emitName) {
    register(shortcut, (e) => {
        if (e.state === "Pressed") {
            emit(emitName, e)
        }
    })
}

export function UpdateShortcutRegister(shortcut, newShortcut, emitName) {
    if (shortcut) {
        unregister(shortcut)
    }
    if (newShortcut) {
        register(newShortcut, (e) => {
            if (e.state === "Pressed") {
                emit(emitName, e)
            }
        })
    }
}

export function isValidShortcut(shortcut) {
    const validModifiers = ["Ctrl", "Alt", "Shift", "Meta"];
    const validKeys = [
        "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M",
        "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z",
        "0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "F1", "F2", "F3",
        "F4", "F5", "F6", "F7", "F8", "F9", "F10", "F11", "F12", "Enter",
        "Escape", "Space", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"
    ];
    const keys = shortcut.split('+').map(key => key.trim());
    if (keys.length === 0) {
        return false;
    }

    let hasMainKey = false;

    for (let i = 0; i < keys.length; i++) {
        const key = keys[i];
        if (validModifiers.includes(key)) {
            if (hasMainKey) {
                return false;
            }
        } else if (validKeys.includes(key)) {
            if (hasMainKey) {
                return false;
            }
            hasMainKey = true;
        } else {
            return false;
        }
    }
    return hasMainKey;
}