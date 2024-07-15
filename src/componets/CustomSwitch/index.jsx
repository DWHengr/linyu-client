import './index.less';

const CustomSwitch = ({ isOn, handleToggle }) => {
    return (
        <div className="switch-container">
            <input
                checked={isOn}
                onChange={handleToggle}
                className="switch-checkbox"
                id={`switch-new`}
                type="checkbox"
            />
            <label
                className="switch-label"
                htmlFor={`switch-new`}
            >
                <span className={`switch-button`} />
            </label>
        </div>
    );
};

export default CustomSwitch;
