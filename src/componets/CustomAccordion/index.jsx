import "./index.less"
import {useEffect, useRef, useState} from "react";

export default function CustomAccordion({title, titleEnd, children, onContextMenu}) {
    const [isOpen, setIsOpen] = useState(false);
    const [contentHeight, setContentHeight] = useState(0)
    const accordionContentRef = useRef(null);

    const toggleAccordion = () => {
        setIsOpen(!isOpen);
    };

    useEffect(() => {
        if (isOpen) {
            setContentHeight(accordionContentRef.current.clientHeight)
        } else {
            setContentHeight(0)
        }
    }, [isOpen])

    return (
        <div className="accordion">
            <div
                className={`accordion-title ${isOpen ? 'open' : ''}`}
                onClick={toggleAccordion}
                onContextMenu={(e) => {
                    e.preventDefault()
                    if (onContextMenu) onContextMenu(e)
                }}
            >
                <i
                    className={`iconfont icon-weixiala arrow ${isOpen ? 'open' : ''}`}
                    style={{fontSize: 12, marginRight: 10}}
                />
                <div className="ellipsis">
                    {title}
                </div>
                <div className="accordion-title-end">
                    {titleEnd}
                </div>
            </div>
            <div
                className="accordion-content"
                style={{
                    maxHeight: contentHeight,
                }}
            >
                <div ref={accordionContentRef}>
                    {children}
                </div>
            </div>
        </div>
    );
}