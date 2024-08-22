import React from 'react';
import './index.less';

const CustomDrawer = ({isOpen, onClose, children}) => {
    const closeDrawer = (e) => {
        if (e.target.classList.contains('drawer-overlay')) {
            onClose();
        }
    };

    return (
        <div className={`drawer-wrapper ${isOpen ? 'open' : ''}`}>
            <div className="drawer-overlay" onClick={closeDrawer}>
                <div className="drawer">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomDrawer;