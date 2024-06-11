import React, {useState, useRef, useEffect} from 'react';
import "./index.less"

const CustomEditableText = ({text, onSave, placeholder}) => {
    const [isEditing, setIsEditing] = useState(false);
    const [value, setValue] = useState(text);
    const inputRef = useRef(null);

    const handleClick = () => {
        setIsEditing(true);
    };

    useEffect(() => {
        setValue(text)
    }, [text]);

    const handleClickOutside = (event) => {
        if (inputRef.current && !inputRef.current.contains(event.target)) {
            setIsEditing(false);
            if (value !== text) {
                onSave(value);
            }
        }
    };

    useEffect(() => {
        if (isEditing) {
            document.addEventListener('mousedown', handleClickOutside);
            inputRef.current.focus();
        } else {
            document.removeEventListener('mousedown', handleClickOutside);
        }
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isEditing, value, text, onSave]);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleBlur = () => {
        setIsEditing(false);
        if (value !== text) {
            onSave(value);
        }
    };

    return (
        <div className="custom-editable-text">
            {isEditing ? (
                <input
                    ref={inputRef}
                    type="text"
                    value={value}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    placeholder={placeholder}
                />
            ) : (
                <span onClick={handleClick}>
          {text || <span style={{color: 'grey'}}>{placeholder ? placeholder : "请设置值"}</span>}
        </span>
            )}
        </div>
    );
};

export default CustomEditableText;
