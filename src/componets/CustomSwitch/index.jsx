import './index.less';
import {useEffect, useState} from "react";

const CustomSwitch = ({isOn, handleToggle}) => {

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
                id={`switch-new`}
                type="checkbox"
            />
            <label
                className="switch-label"
                htmlFor={`switch-new`}
            >
                <span className={`switch-button`}/>
            </label>
        </div>
    );
};

export default CustomSwitch;
