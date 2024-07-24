import React, {useState, useRef, useEffect} from 'react';
import './index.less';

const CustomTooltip = ({placement, title, children}) => {
    const [visible, setVisible] = useState(false);
    const [position, setPosition] = useState({});
    const tooltipRef = useRef(null);
    const childRef = useRef(null);

    useEffect(() => {
        if (visible && childRef.current && tooltipRef.current) {
            const childRect = childRef.current.getBoundingClientRect();
            const tooltipRect = tooltipRef.current.getBoundingClientRect();
            const newPosition = calculatePosition(placement, childRect, tooltipRect);
            console.log(newPosition)
            setPosition(newPosition);
        }
    }, [visible, placement]);

    const showTooltip = () => setVisible(true);
    const hideTooltip = () => setVisible(false);

    const calculatePosition = (placement, childRect, tooltipRect) => {
        switch (placement) {
            case 'top':
                return {
                    top: childRect.top - tooltipRect.height - 4,
                    left: childRect.left + (childRect.width - tooltipRect.width) / 2
                };
            case 'bottom':
                return {top: childRect.bottom, left: childRect.left + (childRect.width - tooltipRect.width) / 2};
            case 'topLeft':
                return {top: childRect.top - tooltipRect.height, left: childRect.left};
            case 'topRight':
                return {top: childRect.top - tooltipRect.height, left: childRect.right - tooltipRect.width};
            case 'bottomLeft':
                return {top: childRect.bottom, left: childRect.left};
            case 'bottomRight':
                return {top: childRect.bottom, left: childRect.right - tooltipRect.width};
            default:
                return {top: childRect.bottom, left: childRect.left};
        }
    };

    return (
        <div className="tooltip-container">
            {visible && title && (
                <div
                    ref={tooltipRef}
                    className={`tooltip-box`}
                    style={{top: `${position.top}px`, left: `${position.left}px`}}
                >
                    {title}
                </div>
            )}
            <div ref={childRef} onMouseEnter={showTooltip} onMouseLeave={hideTooltip}>
                {children}
            </div>
        </div>
    );
};

export default CustomTooltip;
