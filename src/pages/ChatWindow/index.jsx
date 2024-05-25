import "./index.less"
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import {useEffect, useState} from "react";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import ChatListApi from "../../api/chatList.js";
import CommonChatFrame from "../../componets/CommonChatFrame/index.jsx";

export default function ChatWindow() {

    const [userInfo, setUserInfo] = useState(null);

    useEffect(() => {
        let label = WebviewWindow.getCurrent().label;
        let fromId = label.split('-')[1];
        ChatListApi.detail(fromId).then(res => {
            if (res.code === 0) {
                setUserInfo(res.data)
            }
        })
    }, [])

    return (
        <div className="chat-window-container">
            <div className="chat-window">
                {userInfo && <CommonChatFrame userInfo={userInfo}/>}
                <WindowOperation hide={false}/>
            </div>
        </div>
    )
}