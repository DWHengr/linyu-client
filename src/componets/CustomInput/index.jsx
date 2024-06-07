import "./index.less"
import {useState} from "react";

export default function CustomInput({value, onChange, placeholder}) {
    const [inputValue, setInputValue] = useState(value)
    const onCleanValue = () => {
        setInputValue("")
        onChange("")
    }

    return (
        <div className="custom-input">
            <div className="placeholder"></div>
            <input
                placeholder={placeholder}
                value={inputValue}
                onChange={(e) => {
                    setInputValue(e.target.value)
                    if (onChange) onChange(e.target.value)
                }}

            />
            <div className="operation" style={{display: "flex", justifyContent: "center"}}>
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