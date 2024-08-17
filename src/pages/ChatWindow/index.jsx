import "./index.less"
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import {useEffect, useState} from "react";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import ChatListApi from "../../api/chatList.js";
import CommonChatFrame from "../../componets/CommonChatFrame/index.jsx";
import {useDispatch} from "react-redux";
import {addChatWindowUser} from "../../store/chat/action.js";
import CustomBox from "../../componets/CustomBox/index.jsx";

export default function ChatWindow() {

    const [userInfo, setUserInfo] = useState(null);
    let dispatch = useDispatch();

    useEffect(() => {
        let label = WebviewWindow.getCurrent().label;
        let fromId = label.split('-')[1];
        ChatListApi.detail(fromId).then(res => {
            if (res.code === 0) {
                setUserInfo(res.data)
                dispatch(addChatWindowUser(res))
            }
        })
    }, [])

    return (
        <CustomBox className="chat-window">
            {userInfo && <CommonChatFrame userInfo={userInfo}/>}
            <WindowOperation hide={false}/>
        </CustomBox>
    )
}