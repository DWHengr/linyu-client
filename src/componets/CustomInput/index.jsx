import "./index.less"
import {useEffect, useState} from "react";

export default function CustomInput({
                                        value,
                                        onChange,
                                        placeholder,
                                        pre = "",
                                        pos = "",
                                        limit = -1,
                                        type = "input",
                                        required = false,
                                        requiredMsg = "内容不能为空"
                                    }) {
    const [isShowRequiredMsg, setIsShowRequiredMsg] = useState(false)
    const [inputValue, setInputValue] = useState(value)

    const onCleanValue = () => {
        setInputValue("")
        if (onChange)
            onChange("")
        if (required) {
            setIsShowRequiredMsg(true)
        }
    }

    useEffect(() => {
        setInputValue(value)
    }, [value])

    const onRequired = () => {
        if (required && !inputValue) {
            setIsShowRequiredMsg(true)
        } else {
            setIsShowRequiredMsg(false)
        }
    }

    return (
        <div>
            <div className={`custom-input ${isShowRequiredMsg ? "required" : ""}`} onBlur={onRequired}>
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
            {
                required &&
                <div style={{minHeight: 25, fontSize: 12, color: "#ff4c4c"}}>
                    {isShowRequiredMsg ? requiredMsg : ""}
                </div>
            }
        </div>
    )
}