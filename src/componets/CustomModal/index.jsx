import React, {useEffect} from 'react';
import './index.less';

const CustomModal = ({isOpen, onClose, children, overlayColor = "rgba(0,0,0,0.1)"}) => {
    // 处理点击空白处关闭
    useEffect(() => {
        if (!onClose) return
        const handleClickOutside = (event) => {
            if (event.target.classList.contains('modal-overlay')) {
                onClose()
            }
        };

        if (isOpen) {
            window.addEventListener('click', handleClickOutside);
        }

        return () => {
            window.removeEventListener('click', handleClickOutside);
        };
    }, [isOpen, onClose]);

    if (!isOpen) return null;

    return (
        <div>
            <div
                className="modal-overlay"
                style={{backgroundColor: overlayColor}}
                {...(!onClose ? {'data-tauri-drag-region': ''} : {})}
            >
                <div className="modal-content">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomModal;
