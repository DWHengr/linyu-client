import "./index.less"
import {useState} from "react";

export default function CustomUserNameInput({value, onChange}) {
    const [inputValue, setInputValue] = useState(value)
    const onCleanValue = () => {
        setInputValue("")
        onChange("")
    }

    return (
        <div className="custom-username-input">
            <div className="placeholder"></div>
            <input
                type="text"
                placeholder={"请输入用户名"}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    if (onChange) onChange(e.target.value)
                }}

            />
            <div className="operation" style={{width: 40, display: "flex", justifyContent: "center"}}>
                {inputValue ?
                    <i
                        className={`iconfont icon-guanbi operation-icon`}
                        onClick={onCleanValue}
                    /> :
                    <div style={{width: 20}}></div>
                }
                <i className={`iconfont icon-xiala operation-icon`}/>
            </div>
        </div>
    )
}