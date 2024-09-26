import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import {formatTime} from "../../../../utils/date.js";
import {useEffect, useRef, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import NotifyApi from "../../../../api/notify.js";
import Time from "../../../../componets/CommonChatFrame/ChatContent/Time/index.jsx";

export default function SystemNotify() {

    const currentUserId = useRef(null)
    const [notices, setNotices] = useState([])

    useEffect(() => {
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
            onGetSystemNotifyList()
        })
    }, [])

    let onGetSystemNotifyList = () => {
        NotifyApi.systemList().then(res => {
            if (res.code === 0) {
                setNotices(res.data)
            }
        })
    }
    return (
        <div className="system-notify">
            <CustomDragDiv className="system-notify-title">
                <div>系统通知</div>
            </CustomDragDiv>
            <div className="system-notify-content">
                {
                    notices?.map(notify => {
                        return (
                            <div style={{marginTop: 10}} key={notify.id}>
                                <Time value={formatTime(notify.createTime)}/>
                                <div className="system-notify-item">
                                    <div className="system-notify-item-img">
                                        <img className="system-notify-item-img" src={notify.content.img}
                                             alt="加载失败"/>
                                        <div className="system-notify-item-title">{notify.content.title}</div>
                                    </div>
                                    <div className="system-notify-item-text">{notify.content.text}</div>
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