import React, {useState, useEffect, useRef} from 'react';
import './index.less';
import CustomButton from "../CustomButton/index.jsx";

const DropdownButton = ({options, defaultOption, onOptionSelect}) => {
    const [selectedOption, setSelectedOption] = useState(defaultOption);
    const [dropdownVisible, setDropdownVisible] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        setSelectedOption(defaultOption);
    }, [defaultOption]);

    const handleOptionSelect = (option) => {
        setSelectedOption(option);
        setDropdownVisible(false);
        onOptionSelect(option);
    };

    const handleBlur = (e) => {
        if (!dropdownRef.current.contains(e.relatedTarget)) {
            setDropdownVisible(false);
        }
    };


    return (
        <div
            className="dropdown-button"
            tabIndex="0"
            onBlur={handleBlur}
            ref={dropdownRef}
        >
            <div style={{display: "flex"}}>
                <CustomButton
                    style={{fontSize: 12, paddingTop: 0, paddingBottom: 0}}
                    width={36}
                >
                    {selectedOption.label}
                </CustomButton>
                <div
                    style={{
                        width: 20,
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center"
                    }}
                    onClick={() => setDropdownVisible(!dropdownVisible)}
                >
                    <i
                        className={`iconfont icon-xiala`}
                        style={{fontSize: 12}}
                    />
                </div>
            </div>
            {dropdownVisible && (
                <ul className="dropdown-menu">
                    {options.map((option) => {
                            return (
                                option.key !== selectedOption.key ? <li
                                    key={option.key}
                                    onClick={() => handleOptionSelect(option)}>
                                    {option.label}
                                </li> : <></>
                            )
                        }
                    )}
                </ul>
            )}
        </div>
    );
};

export default DropdownButton;
