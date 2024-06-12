import React, {useState, useRef, useEffect} from 'react';
import './index.less';

const CustomDropdown = ({options, defaultValue, onSelect, width = 80, placeholder = "请选择内容"}) => {
    const [isOpen, setIsOpen] = useState(false);
    const [selectedValue, setSelectedValue] = useState(defaultValue || '');

    const dropdownRef = useRef(null);

    useEffect(() => {
        setSelectedValue(defaultValue)
    }, [defaultValue])

    const toggleDropdown = () => {
        setIsOpen(!isOpen);
    };

    const handleSelect = (option) => {
        setSelectedValue(option.label);
        if (onSelect) onSelect(option);
        setIsOpen(false);
    };

    const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
            setIsOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="custom-select" ref={dropdownRef}>
            <div className="selected-box" onClick={toggleDropdown}>
                <div className="selected-value" style={{width: width}}>
                    {selectedValue || placeholder}
                </div>
                <i
                    className={`iconfont icon-xiala operation-icon arrow`}
                    onClick={() => setShowRecentInput(!showRecentInput)}
                />
            </div>
            {isOpen && (
                <div className="options">
                    {options.map((option, index) => (
                        <div
                            key={index}
                            className={`option ${selectedValue === option.value ? 'selected' : ''}`}
                            onClick={() => handleSelect(option)}
                        >
                            {option.label}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CustomDropdown;
