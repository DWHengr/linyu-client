import "./index.less"
import IconMinorButton from "../IconMinorButton/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import Text from "./ChatContent/Text/index.jsx";
import CustomDragDiv from "../CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import {listen} from "@tauri-apps/api/event";
import MessageApi from "../../api/message.js";
import {invoke} from "@tauri-apps/api/tauri";

export default function CommonChatFrame({toId}) {

    const [messages, setMessages] = useState([])
    const showFrameRef = useRef(null)
    const currentToId = useRef(toId);
    const [msgContentValue, setMsgContentValue] = useState(null)
    const messagesRef = useRef([]);
    const currentUserId = useRef(toId);

    useEffect(() => {
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
        })
        const unListen = listen('on-msg', (event) => {
            let data = event.payload
            if (currentToId.current === data.fromId) {
                messagesRef.current.push(data)
                setMessages(() => [...messagesRef.current])
            }
        });
        return async () => {
            (await unListen)()
        }
    }, [])

    useEffect(() => {
        currentToId.current = toId
    }, [toId])

    useEffect(() => {
        const container = showFrameRef.current
        container.scrollTop = container.scrollHeight
    }, [messages])

    let onSendMsg = () => {
        let msg = {
            toUserId: currentToId.current,
            msgContent: {
                type: "text",
                content: msgContentValue
            },
            isShowTime: true
        }
        MessageApi.sendMsg(msg).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    messagesRef.current.push(res.data)
                    setMessages(() => [...messagesRef.current])
                }
            }
        })
        setMsgContentValue("")
    }

    return (<div className="common-chat-content">
        <CustomDragDiv className="chat-content-title">
            <div>
                <div style={{
                    width: 40, height: 40, backgroundColor: "#4C9BFF", borderRadius: 50, marginLeft: 10
                }}>
                </div>
            </div>
            <div style={{
                fontWeight: 600, color: "#1F1F1F", marginLeft: 10,
            }}>
                小红
            </div>
        </CustomDragDiv>
        <div ref={showFrameRef} className="chat-content-show-frame">
            {messages?.map((msg) => {
                return (
                    <Text key={msg.id} value={msg.msgContent.content} right={msg.fromId === currentUserId.current}/>)
            })}
        </div>
        <div className="chat-content-send-frame">
            <div className="chat-content-send-frame-operation">
                <div style={{display: "flex"}}>
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-biaoqing`} style={{fontSize: 24}}/>}/>
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-wenjian`} style={{fontSize: 26}}/>}/>
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-jilu`} style={{fontSize: 22}}/>}/>
                </div>
                <div style={{display: "flex"}}>
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-dianhua`} style={{fontSize: 24}}/>}/>
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-shipin`} style={{fontSize: 26}}/>}/>
                </div>
            </div>
            <div className="chat-content-send-frame-msg">
                        <textarea
                            value={msgContentValue}
                            onChange={(e) => setMsgContentValue(e.target.value)}
                        >
                        </textarea>
            </div>
            <div className="chat-content-send-frame-operation-bottom">
                <CustomButton width={10}>
                    <i className={`iconfont icon icon-yuyin`} style={{fontSize: 14}}/>
                </CustomButton>
                <CustomButton
                    width={40}
                    onClick={onSendMsg}
                >
                    发送
                </CustomButton>
            </div>
        </div>
    </div>)
}