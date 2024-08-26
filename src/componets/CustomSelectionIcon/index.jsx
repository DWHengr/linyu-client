import React from 'react';

const SelectionIcon = ({status, style}) => {
    const getIconColor = () => {
        switch (status) {
            case 'selected':
                return '#4C9BFF';
            case 'unselected':
                return '#E0E0E0';
            case 'disabled':
                return 'rgba(76,155,255,0.45)';
            default:
                return '#E0E0E0';
        }
    };

    return (
        <svg
            style={style}
            t="1724402050248" className="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg"
            p-id="4945" width="200" height="200"
        >
            <path
                d="M511.998465 33.382295c-264.329201 0-478.615659 214.287481-478.615659 478.617705 0 264.330224 214.287481 478.616682 478.615659 478.616682 264.331247 0 478.617705-214.286458 478.617705-478.616682C990.61617 247.669776 776.328689 33.382295 511.998465 33.382295zM478.969211 690.857551l-43.99705 44.729737-44.028772-44.729737L192.828238 489.595734l44.028772-44.729737 198.11515 201.261816 352.169805-357.794919 44.027749 44.729737L478.969211 690.857551z"
                fill={getIconColor(status)} p-id="4946"></path>
        </svg>
    );
};

export default SelectionIcon;