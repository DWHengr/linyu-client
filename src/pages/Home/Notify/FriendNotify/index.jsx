import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import DropdownButton from "../../../../componets/DropdownButton/index.jsx";
import NotifyApi from "../../../../api/notify.js";
import {formatTime} from "../../../../utils/date.js";
import {listen} from "@tauri-apps/api/event";
import FriendApi from "../../../../api/friend.js";

export default function FriendNotify() {

    const currentUserId = useRef(null)
    const [notices, setNotices] = useState([])

    useEffect(() => {
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
            onGetFriendNotifyList()
        })
    }, [])

    let onGetFriendNotifyList = () => {
        NotifyApi.friendList().then(res => {
            if (res.code === 0) {
                setNotices(res.data)
            }
        })
    }

    useEffect(() => {
        const unNotifyListen = listen('on-receive-notify', (event) => {
            onGetFriendNotifyList()
        });
        return async () => {
            (await unNotifyListen)();
        }
    }, [])

    let buttonOperate = [
        {key: "agree", label: "同意"},
        {key: "reject", label: "拒绝"}
    ]
    let getContentTip = (status, isFromCurrentUser) => {
        if (!isFromCurrentUser) return "请求加你为好友"
        switch (status) {
            case "wait": {
                return "正在验证你的请求"
            }
            case "reject": {
                return "对方已拒绝你的请求"
            }
            case "agree": {
                return "对方已同意你的请求"
            }
        }
    }

    let onAgreeFriendApply = (notifyId) => {
        FriendApi.agree({notifyId: notifyId}).then(res => {
            onGetFriendNotifyList()
        })
    }

    let onOptionSelect = (option, notifyId) => {
        switch (option.key) {
            case "agree": {
                onAgreeFriendApply(notifyId)
                break
            }
        }
    }

    let getOperateTip = (notify, isFromCurrentUser) => {
        if (!isFromCurrentUser && notify.status === "wait") {
            return (
                <DropdownButton
                    options={buttonOperate}
                    defaultOption={buttonOperate[0]}
                    onOptionSelect={(o) => onOptionSelect(o, notify.id)}
                />
            )
        }
        switch (notify.status) {
            case "wait": {
                return "等待验证"
            }
            case "reject": {
                return "已拒绝"
            }
            case "agree": {
                return "已同意"
            }
        }
    }

    return (
        <div className="friend-notify">
            <CustomDragDiv className="friend-notify-title">
                <div>好友通知</div>
            </CustomDragDiv>
            <div className="friend-notify-content">
                {
                    notices?.map((notify) => {
                        let isFromCurrentUser = currentUserId.current === notify.fromId
                        return (
                            <div
                                key={notify.id}
                                className="friend-notify-item"
                            >

                                <div className="friend-notify-item-left">
                                    <img
                                        style={{width: 50, height: 50, borderRadius: 50, marginRight: 8}}
                                        src={isFromCurrentUser ? notify.toPortrait : notify.fromPortrait}
                                        alt="portrait"
                                    />
                                    <div>
                                        <div style={{display: "flex"}}>
                                            <div style={{color: "#4C9BFF", marginRight: 8}}>
                                                {isFromCurrentUser ? notify.toName : notify.fromName}
                                            </div>
                                            <div
                                                style={{marginRight: 8}}>{getContentTip(notify.status, isFromCurrentUser)}
                                            </div>
                                            <div style={{color: "#a9a9a9"}}>{formatTime(notify.createTime)}</div>
                                        </div>
                                        <div style={{color: "#a9a9a9"}}>
                                            {notify.content}
                                        </div>
                                    </div>
                                </div>
                                <div style={{width: 80}}>
                                    {getOperateTip(notify, isFromCurrentUser)}
                                </div>
                            </div>
                        )
                    })
                }
                {
                    notices.length <= 0 &&
                    <CustomDragDiv
                        style={{display: "flex", height: "100%", alignItems: "center", justifyContent: "center"}}
                    >
                        <img style={{height: 120}} src="/bg.png" alt=""/>
                    </CustomDragDiv>
                }
            </div>
        </div>
    )
}