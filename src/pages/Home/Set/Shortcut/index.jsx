import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import CustomLine from "../../../../componets/CustomLine/index.jsx";
import CustomShortcutInput from "../../../../componets/CustomShortcutInput/index.jsx";
import {useEffect, useState} from "react";
import {getItem, setItem} from "../../../../utils/storage.js";
import {UpdateShortcutRegister} from "../../../../utils/shortcut.js";
import UserSetApi from "../../../../api/userSet.js";

export default function Shortcut() {
    const [userSets, SetUserSets] = useState({})

    useEffect(() => {
        getItem("user-sets").then(value => {
            SetUserSets(value)
        })
    }, [])

    const handleOnChange = (key, value) => {
        SetUserSets(pre => {
            let newPre = {...pre, [key]: value}
            UpdateShortcutRegister(pre[key], value, key)
            UserSetApi.update({key, value})
            setItem("user-sets", newPre)
            return newPre;
        })
    }


    return (
        <div className="shortcut-set">
            <CustomDragDiv className="shortcut-set-title">
                <div>快捷键</div>
            </CustomDragDiv>
            <div className="shortcut-set-content">
                <div className="set-item">
                    <div className="set-item-options">
                        <div className="set-item-option">
                            <div>截图</div>
                            <CustomShortcutInput value={userSets.screenshot}
                                                 onChange={(v) => handleOnChange("screenshot", v)}/>
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>打开未读会话</div>
                            <CustomShortcutInput value={userSets.openUnreadMsg}
                                                 onChange={(v) => handleOnChange("openUnreadMsg", v)}/>
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>隐藏/显示主面板</div>
                            <CustomShortcutInput value={userSets.hideOrShowHome}
                                                 onChange={(v) => handleOnChange("hideOrShowHome", v)}/>
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>关闭会话窗口</div>
                            <CustomShortcutInput value={userSets.closeMsgWindow}
                                                 onChange={(v) => handleOnChange("closeMsgWindow", v)}/>
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>命令行模式</div>
                            <CustomShortcutInput value={userSets.command}
                                                 onChange={(v) => handleOnChange("command", v)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}