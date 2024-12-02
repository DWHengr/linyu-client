import './index.less';
import {useEffect, useState} from "react";

const CustomSwitch = ({id, isOn, handleToggle}) => {

    const [value, setValue] = useState(isOn)

    useEffect(() => {
        setValue(isOn)
    }, [isOn])

    return (
        <div className="switch-container">
            <input
                checked={value}
                onChange={handleToggle}
                className="switch-checkbox"
                type="checkbox"
                id={id}
            />
            <label
                className="switch-label"
                htmlFor={id}
            >
                <span className={`switch-button`}/>
            </label>
        </div>
    );
};

export default CustomSwitch;
