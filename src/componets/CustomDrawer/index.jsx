import React from 'react';
import './index.less';

const CustomDrawer = ({isOpen, onClose, children, width = 300}) => {
    const closeDrawer = (e) => {
        if (e.target.classList.contains('drawer-overlay')) {
            onClose();
        }
    };

    return (
        <div className={`drawer-wrapper ${isOpen ? 'open' : ''}`}>
            <div className="drawer-overlay" onClick={closeDrawer}>
                <div className="drawer" style={{width: width}}>
                    {children}
                </div>
            </div>
        </div>
    );
};

export default CustomDrawer;