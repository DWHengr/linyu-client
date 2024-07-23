import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import CustomLine from "../../../../componets/CustomLine/index.jsx";
import CustomSwitch from "../../../../componets/CustomSwitch/index.jsx";
import {useEffect, useState} from "react";
import {getItem, setItem} from "../../../../utils/storage.js";
import UserSetApi from "../../../../api/userSet.js";

export default function MessageNotify() {
    const [userSets, SetUserSets] = useState({})

    useEffect(() => {
        getItem("user-sets").then(value => {
            SetUserSets(value)
        })
    }, [])

    const handleOnChange = (key, value) => {
        SetUserSets(pre => {
            let newPre = {...pre, [key]: value}
            UserSetApi.update({key, value})
            setItem("user-sets", newPre)
            return newPre;
        })
    }

    return (
        <div className="message-notify-set">
            <CustomDragDiv className="message-notify-set-title">
                <div>消息通知</div>
            </CustomDragDiv>
            <div className="message-notify-set-content">
                <div className="set-item">
                    <div className="set-item-label">通知提醒</div>
                    <div className="set-item-options">
                        <div className="set-item-option">
                            <div>好友消息</div>
                            <CustomSwitch isOn={userSets.friendMsgNotify}
                                          handleToggle={() => handleOnChange("friendMsgNotify", !userSets.friendMsgNotify)}/>
                        </div>
                    </div>
                </div>
                <div className="set-item">
                    <div className="set-item-label">提示音</div>
                    <div className="set-item-options">
                        <div className="set-item-option">
                            <div>消息提示音</div>
                            <CustomSwitch isOn={userSets.msgTone}
                                          handleToggle={() => handleOnChange("msgTone", !userSets.msgTone)}/>
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>音视频提示音</div>
                            <CustomSwitch isOn={userSets.audioVideoTone}
                                          handleToggle={() => handleOnChange("audioVideoTone", !userSets.audioVideoTone)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}