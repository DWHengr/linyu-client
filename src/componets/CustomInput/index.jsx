import "./index.less"
import {useState} from "react";

export default function CustomInput({value, onChange, placeholder, pre = "", pos = "", limit = -1, type = "input"}) {
    const [inputValue, setInputValue] = useState(value)

    const onCleanValue = () => {
        setInputValue("")
        if (onChange)
            onChange("")
    }

    return (
        <div className="custom-input">
            {pre && <div className="pre">
                {pre}
            </div>}
            <input
                placeholder={placeholder}
                value={inputValue}
                type={type}
                onChange={(e) => {
                    if (e.target.value.length <= limit || limit === -1) {
                        setInputValue(e.target.value)
                        if (onChange) onChange(e.target.value)
                    }
                }}

            />
            <div className="operation" style={{display: "flex", justifyContent: "center"}}>
                <div className={`operation-icon`}/>
                {inputValue && type !== "date" ?
                    <i
                        className={`iconfont icon-guanbi operation-icon`}
                        onClick={onCleanValue}
                    /> :
                    <div style={{width: 20}}></div>
                }
            </div>
            {limit > 0 &&
                <div className="character-count">{`${inputValue?.length ? inputValue?.length : 0}/${limit}`}</div>}
            <div>{pos}</div>
        </div>
    )
}