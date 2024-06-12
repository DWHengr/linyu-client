import React, {useRef} from 'react';
import "./index.less"

const RichTextEditor = React.forwardRef((props, ref) => {
    const editorRef = useRef(null);

    const handlePaste = (event) => {
        event.preventDefault();
        const clipboardData = event.clipboardData;
        const text = clipboardData.getData('text');
        const items = clipboardData.items;

        let hasImage = false;

        for (let i = 0; i < items.length; i++) {
            if (items[i].type.indexOf('image') !== -1) {
                hasImage = true;
                const blob = items[i].getAsFile();
                const reader = new FileReader();
                reader.onload = function (event) {
                    const img = document.createElement('img');
                    img.src = event.target.result;
                    editorRef.current.appendChild(img);
                    moveCursorToEnd();
                };
                reader.readAsDataURL(blob);
            }
        }

        if (!hasImage && text) {
            document.execCommand('insertText', false, text);
        }
    };

    const moveCursorToEnd = () => {
        const range = document.createRange();
        const selection = window.getSelection();
        // 将光标移到内容的最后
        range.selectNodeContents(editorRef.current);
        range.collapse(false);
        selection.removeAllRanges();
        selection.addRange(range);
    };

    const handleKeyDown = (event) => {
        if (props.onKeyDown) {
            props.onKeyDown(event);
        }
    };

    React.useImperativeHandle(ref, () => {
        editorRef.current.focus = () => {
            moveCursorToEnd();
        }
        return editorRef.current
    });

    return (
        <div
            ref={editorRef}
            contentEditable={true}
            onPaste={handlePaste}
            onChange={() => console.log(12312421)}
            onKeyDown={handleKeyDown}
            className="rich-text-editor"
        ></div>
    );
});

export default RichTextEditor;
