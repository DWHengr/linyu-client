import "./index.less"
import {useEffect, useRef, useState} from "react";
import CustomOverlay from "../CustomOverlay/index.jsx";

export default function CustomUserNameInput({value, onChange, reagents, onDeleteItem}) {
    const [inputValue, setInputValue] = useState(value)
    const [showRecentInput, setShowRecentInput] = useState(false)
    const recentRef = useRef(null)
    let usernameInputRef = useRef(null)
    const [usernameDivInfo, setUsernameDivInfo] = useState({})

    useEffect(() => {
        if (usernameInputRef) {
            setUsernameDivInfo(usernameInputRef.current.getBoundingClientRect())
        }
    }, [usernameInputRef])
    const onCleanValue = () => {
        setInputValue("")
        onChange("")
    }

    const handlerChangeValue = (value) => {
        setInputValue(value)
        if (onChange) onChange(value)
    }

    const handlerDeleteItem = (item) => {
        if (onDeleteItem) onDeleteItem(item)
    }

    return (
        <div
            className="custom-username-input"
            ref={usernameInputRef}
        >
            <div className="custom-username-input-content">
                <div className="placeholder"></div>
                <input
                    type="text"
                    placeholder={"请输入用户名"}
                    value={inputValue}
                    onChange={(e) => {
                        handlerChangeValue(e.target.value)
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
                    <i
                        className={`iconfont icon-xiala operation-icon`}
                        onClick={() => {
                            setShowRecentInput(!showRecentInput)
                        }}
                    />
                </div>
            </div>
            <CustomOverlay
                position={
                    {
                        x: usernameDivInfo.top + usernameDivInfo.height,
                        y: usernameDivInfo.left
                    }
                }
                visible={showRecentInput}
                width={usernameDivInfo.width}
                onClose={() => {
                    setShowRecentInput(false)
                }}
            >
                {reagents?.length > 0 &&
                    <div
                        className="custom-user-input-down"
                        ref={recentRef}
                    >
                        {
                            reagents?.map((item, index) => {
                                return (
                                    <div
                                        key={index}
                                        className="custom-user-input-down-item"
                                        onClick={() => {
                                            handlerChangeValue(item)
                                            setShowRecentInput(false)
                                        }}
                                    >
                                        <div>
                                            {item}
                                        </div>
                                        <div style={{color: "#969696"}} onClick={(e) => {
                                            e.stopPropagation()
                                            handlerDeleteItem(item)
                                        }}>
                                            <i
                                                className={`iconfont icon-guanbi operation-icon`}
                                            />
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                }
            </CustomOverlay>
        </div>
    )
}