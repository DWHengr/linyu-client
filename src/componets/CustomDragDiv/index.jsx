import {emit} from "@tauri-apps/api/event";

export default function CustomDragDiv(props) {
    return (
        <div {...props} data-tauri-drag-region onMouseDown={() => emit('drag-click', {})}>
            {props.children}
        </div>
    )
}