import "./index.less"
import IconMinorButton from "../IconMinorButton/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import Text from "./ChatContent/Text/index.jsx";
import CustomDragDiv from "../CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import {listen} from "@tauri-apps/api/event";
import MessageApi from "../../api/message.js";
import {invoke} from "@tauri-apps/api/tauri";

export default function CommonChatFrame({userInfo}) {

    const [messages, setMessages] = useState([])
    const showFrameRef = useRef(null)
    const currentToId = useRef(userInfo.fromId)//消息目标用户
    const [msgContentValue, setMsgContentValue] = useState(null)//输入框消息内容
    const messagesRef = useRef([])//保持会话的消息
    const currentUserId = useRef(null)//当前用户
    const currentMsgRecordIndex = useRef(0)//消息记录查询的索引
    const scrollTriggered = useRef(false) //滚动条是否触发
    const isQueryComplete = useRef(false) //消息记录是否全部加载
    const userInfoRef = useRef(userInfo)

    useEffect(() => {
        //获取当前用户
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
        })
        //监听后端发送的消息
        const unListen = listen('on-receive-msg', (event) => {
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
        //滚动条顶部触发加载记录
        const handleScroll = () => {
            if (isQueryComplete.current) return
            if (showFrameRef.current && !scrollTriggered.current) {
                const scrollTop = showFrameRef.current.scrollTop;
                const threshold = 0;
                if (scrollTop <= threshold) {
                    scrollTriggered.current = true
                    onMessageRecord()
                }
            }
        };
        const scrollContainer = showFrameRef.current;
        if (scrollContainer) {
            scrollContainer.addEventListener('scroll', handleScroll);
        }
        return () => {
            if (scrollContainer) {
                scrollContainer.removeEventListener('scroll', handleScroll);
            }
        };
    }, [])


    const onMessageRecord = () => {
        //记录当前滚动条位置
        const container = showFrameRef.current;
        const scrollHeightBeforeLoad = container.scrollHeight;
        const scrollTopBeforeLoad = container.scrollTop;
        //获取消息记录
        MessageApi.record({
            targetId: userInfoRef.current.fromId, index: currentMsgRecordIndex.current, num: 20
        }).then(res => {
            if (res.code === 0) {
                if (res.data.length > 0) {
                    messagesRef.current = [...res.data, ...messagesRef.current]
                    setMessages([...messagesRef.current])
                    currentMsgRecordIndex.current += 20
                    //调整滚动条
                    requestAnimationFrame(() => {
                        const scrollHeightAfterLoad = container.scrollHeight;
                        container.scrollTop = scrollTopBeforeLoad + (scrollHeightAfterLoad - scrollHeightBeforeLoad);
                    });
                } else {
                    scrollTriggered.current = false
                    isQueryComplete.current = true
                }
            }
        })
    }

    useEffect(() => {
        userInfoRef.current = userInfo
        //会话切换，重置
        isQueryComplete.current = false
        currentMsgRecordIndex.current = 0
        scrollTriggered.current = false
        messagesRef.current = []
        setMessages([])
        currentToId.current = userInfo.fromId
        onMessageRecord()
    }, [userInfo])

    useEffect(() => {
        //顶部加载的数据，不改变滚动条到底部
        if (scrollTriggered.current) {
            scrollTriggered.current = false
        } else {
            const container = showFrameRef.current
            container.scrollTop = container.scrollHeight
        }
    }, [messages])

    let onSendMsg = () => {
        if (!msgContentValue) return
        let msg = {
            toUserId: currentToId.current, msgContent: {
                type: "text", content: msgContentValue
            }, isShowTime: true
        }
        MessageApi.sendMsg(msg).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    messagesRef.current.push(res.data)
                    setMessages(() => [...messagesRef.current])
                    emit("on-send-msg", {})
                }
            }
        })
        setMsgContentValue("")
    }

    const onContentKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            onSendMsg()
        }
    };

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
                {userInfo.remark ? userInfo.remark : userInfo.name}
            </div>
        </CustomDragDiv>
        <div ref={showFrameRef} className="chat-content-show-frame">
            {messages?.map((msg) => {
                return (
                    <Text key={msg.id} value={msg.msgContent?.content} right={msg.fromId === currentUserId.current}/>)
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
                            onKeyDown={(e) => onContentKeyDown(e)}
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