import React, {useEffect, useRef} from 'react';
import ReactQuill, {Quill} from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import "./index.css"
import CreateImageViewer from "../../pages/ImageViewer/window.jsx";


const InlineEmbed = Quill.import('blots/embed');

class CustomImage extends InlineEmbed {
    static create(value) {
        let node = super.create(value);
        node.setAttribute('src', value.url);
        node.setAttribute('alt', value.alt || '');
        node.setAttribute('style', `height: ${'80px' || 'auto'};display: inline;`);
        node.addEventListener('dblclick', () => {
            CreateImageViewer("img.png", value.url)
        });
        return node;
    }

    static value(node) {
        return {
            url: node.getAttribute('src'),
            alt: node.getAttribute('alt'),
            width: node.style.width,
            height: node.style.height
        };
    }
}

CustomImage.blotName = 'customImage';
CustomImage.tagName = 'img';

// 注册自定义 Image Blot
Quill.register({
    'formats/customImage': CustomImage
});


const QuillRichTextEditor = React.forwardRef(({value, onChange, onKeyDown}, ref) => {
    const quillRef = useRef(null);

    useEffect(() => {
        const quill = quillRef.current.getEditor();

        quill.clipboard.addMatcher(Node.ELEMENT_NODE, (node, delta) => {
            if (node.tagName === 'IMG' || node.tagName === 'img') {
                return delta;
            }
            let plaintext = node.innerText;
            delta.ops = [];
            delta.insert(plaintext);
            return delta;
        });
    }, []);

    React.useImperativeHandle(ref, () => ({
        focus: () => {
            if (quillRef.current) {
                quillRef.current.focus();
            }
        },
        insertEmojiOrText: (value) => {
            if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                let range = quill.getSelection(true);
                if (range) {
                    quill.insertText(range.index, value);
                    quill.setSelection(range.index + value.length);
                }
            }
        },
        insertImage: (imageUrl) => {
            if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                let range = quill.getSelection(true);
                if (range) {
                    quill.insertEmbed(range.index - 1, 'customImage', {url: imageUrl, alt: 'Custom Image'});
                    quill.setSelection(range.index + 1);
                }
            }
        },
        getContent: () => {
            let isNull = true;
            if (quillRef.current) {
                const quill = quillRef.current.getEditor();
                const contents = quill.getContents();
                let data = [];
                contents.ops.forEach(op => {
                    if (op.insert.hasOwnProperty('customImage')) {
                        isNull = false;
                        data.push({
                            type: 'img',
                            url: op.insert.customImage.url,
                            alt: op.insert.customImage.alt
                        });
                    } else if (typeof op.insert === 'string') {
                        if (op.insert.trim()) {
                            isNull = false;
                            data.push({type: 'text', text: op.insert.trim()});
                        }
                    }
                });
                return {isNull, data};
            }
            return {};
        }
    }));

    const modules = {
        toolbar: false,
        clipboard: {
            matchVisual: false,
        }
    };

    return (
        <div className="editor-container" onKeyDown={onKeyDown}>
            <ReactQuill
                ref={quillRef}
                value={value}
                onChange={onChange}
                modules={modules}
                style={{height: '100%', width: '100%'}}
            />
        </div>
    );
});

export default QuillRichTextEditor;
