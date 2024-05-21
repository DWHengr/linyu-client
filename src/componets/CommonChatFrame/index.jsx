import "./index.less"
import IconMinorButton from "../IconMinorButton/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import Text from "./ChatContent/Text/index.jsx";
import CustomDragDiv from "../CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import {listen} from "@tauri-apps/api/event";
import MessageApi from "../../api/message.js";

export default function CommonChatFrame({userId}) {

    const [messages, setMessages] = useState([])
    const showFrameRef = useRef(null)
    const fromId = useRef(userId);
    const [msgContentValue, setMsgContentValue] = useState(null)

    useEffect(() => {
        const unListen = listen('on-msg', (event) => {
            let data = event.payload
            if (fromId.current === data.fromId) messages.push(data)
            setMessages([...messages])
        });
        return async () => {
            (await unListen)()
        }
    }, [])

    useEffect(() => {
        fromId.current = userId
    }, [userId])

    useEffect(() => {
        const container = showFrameRef.current
        container.scrollTop = container.scrollHeight
    }, [messages])

    let onSendMsg = () => {
        MessageApi.sendMsg({
            toUserId: fromId,
            msgContent: {
                type: "text",
                content: msgContentValue
            },
            isShowTime: true
        }).then(res => {
            if (res.code === 0) {

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
                return (<Text key={msg.id} value={msg.msgContent.content}/>)
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