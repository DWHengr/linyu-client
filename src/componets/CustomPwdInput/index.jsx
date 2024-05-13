import "./index.less"
import {useState} from "react";

export default function CustomPwdInput({value, onChange}) {
    const [inputValue, setInputValue] = useState(value)
    const onCleanValue = () => {
        setInputValue("")
        onChange("")
    }

    return (
        <div className="custom-pwd-input">
            <div className="placeholder"></div>
            <input
                type="password"
                placeholder={"请输入密码"}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    if (onChange) onChange(e.target.value)
                }}

            />
            <div className="operation" style={{width: 40, display: "flex", justifyContent: "center"}}>
                <div className={`operation-icon`}/>
                {inputValue ?
                    <i
                        className={`iconfont icon-guanbi operation-icon`}
                        onClick={onCleanValue}
                    /> :
                    <div style={{width: 20}}></div>
                }
            </div>
        </div>
    )
}