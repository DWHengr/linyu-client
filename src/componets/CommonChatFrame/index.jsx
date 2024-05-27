import "./index.less"
import IconMinorButton from "../IconMinorButton/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import Text from "./ChatContent/Text/index.jsx";
import CustomDragDiv from "../CustomDragDiv/index.jsx";
import {memo, useEffect, useRef, useState} from "react";
import {emit, listen} from "@tauri-apps/api/event";
import MessageApi from "../../api/message.js";
import {invoke} from "@tauri-apps/api/core";
import CustomOverlay from "../CustomOverlay/index.jsx";
import {emojis} from "../../utils/emoji.js";

function CommonChatFrame({userInfo}) {

    const [messages, setMessages] = useState([])
    const showFrameRef = useRef(null)
    const currentToId = useRef(userInfo.fromId)//消息目标用户
    const msgContentRef = useRef(null)//输入框消息内容
    const messagesRef = useRef([])//保持会话的消息
    const currentUserId = useRef(null)//当前用户
    const currentMsgRecordIndex = useRef(0)//消息记录查询的索引
    const scrollTriggered = useRef(false) //滚动条是否触发
    const isQueryComplete = useRef(false) //消息记录是否全部加载
    const userInfoRef = useRef(userInfo)
    const newMsgUnreadNumRef = useRef(0)
    const [newMsgUnreadNum, setNewMsgUnreadNum] = useState(newMsgUnreadNumRef.current)

    //表情
    const [biaoQingIsShow, setBiaoQingIsShow] = useState(false);
    const [biaoQingIsPosition, setBiaoQingIsPosition] = useState({});
    const biaoQingPopSize = useRef({width: 290, height: 140})
    const [scrollDirection, setScrollDirection] = useState('up');

    useEffect(() => {
        //获取当前用户
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
        })
        //监听后端发送的消息
        const unListen = listen('on-receive-msg', (event) => {
            let data = event.payload
            if (currentToId.current === data.fromId) {
                //判断当前滚动位置
                const {scrollTop, scrollHeight, clientHeight} = showFrameRef.current;
                if (scrollTop + clientHeight + 2 >= scrollHeight) {
                    newMsgUnreadNumRef.current = 0
                    setNewMsgUnreadNum(newMsgUnreadNumRef.current)
                } else {
                    scrollTriggered.current = true
                    newMsgUnreadNumRef.current++
                    setNewMsgUnreadNum(newMsgUnreadNumRef.current)
                }
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
            //是否到底底部
            const {scrollTop, scrollHeight, clientHeight} = showFrameRef.current;
            if (scrollTop + clientHeight + 2 >= scrollHeight) {
                newMsgUnreadNumRef.current = 0
                setNewMsgUnreadNum(newMsgUnreadNumRef.current)
            }

            //是否触发顶部获取记录
            if (isQueryComplete.current) return
            if (showFrameRef.current && !scrollTriggered.current) {
                const scrollTop = showFrameRef.current.scrollTop;
                const threshold = 10;
                if (0 < scrollTop && scrollTop <= threshold) {
                    scrollTriggered.current = true
                    onMessageRecord()
                }
            }

            //获取滚动条方向
            const div = showFrameRef.current;
            if (scrollTop > div._prevScrollPosition) {
                setScrollDirection('down');
            } else {
                setScrollDirection('up');
            }
            // 保存当前滚动位置
            div._prevScrollPosition = scrollTop;
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
    }, []);

    useEffect(() => {
        if (scrollDirection === 'up') {

        } else {
            const {scrollTop, scrollHeight, clientHeight} = showFrameRef.current;
            if (scrollTop + clientHeight < scrollHeight * 0.8 && newMsgUnreadNum <= 0) {
                setNewMsgUnreadNum(-1)
            }
        }
    }, [scrollDirection])

    const onMessageRecord = () => {
        if (isQueryComplete.current) return
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
                    setMessages(messagesRef.current)
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
        scrollTriggered.current = true
        messagesRef.current = []
        setMessages([])
        currentToId.current = userInfo.fromId
        const container = showFrameRef.current
        container.scrollTop = container.scrollHeight
        onMessageRecord()
    }, [userInfo])

    const onScrollToBottom = () => {
        const container = showFrameRef.current
        container.scrollTop = container.scrollHeight
    }

    useEffect(() => {
        //顶部加载的数据，不改变滚动条到底部
        if (scrollTriggered.current) {
            scrollTriggered.current = false
        } else {
            onScrollToBottom()
        }
    }, [messages])

    let onSendMsg = () => {
        if (!msgContentRef.current.value) return
        let msg = {
            toUserId: currentToId.current, msgContent: {
                type: "text", content: msgContentRef.current.value
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
        msgContentRef.current.value = ""
    }

    const onContentKeyDown = (event) => {
        if (event.key === 'Enter') {
            event.preventDefault()
            onSendMsg()
        }
    };

    //表情
    const BiaoQingPop = () => {
        return (<div
            style={{zIndex: 999}}
        >
            <CustomOverlay
                position={{x: biaoQingIsPosition.x, y: biaoQingIsPosition.y}}
                visible={biaoQingIsShow}
                onClose={() => setBiaoQingIsShow(false)}
            >
                <div
                    style={{
                        width: biaoQingPopSize.current.width, height: biaoQingPopSize.current.height,
                    }}
                    className="biao-qing-pop"
                >
                    {emojis.map((emoji, index) => {
                        return (<div
                            onClick={() => {
                                msgContentRef.current.value += emoji
                                setBiaoQingIsShow(false)
                                msgContentRef.current.focus()
                            }}
                            className="biao-qing" key={index}>
                            {emoji}
                        </div>)
                    })}
                </div>
            </CustomOverlay>
        </div>)
    }

    return (<div className="common-chat-content">
        <BiaoQingPop/>
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
            {newMsgUnreadNum !== 0 && <div className="hint" onClick={onScrollToBottom}>
                <i className={`iconfont icon icon-xiala`} style={{fontSize: 12}}/>
                {newMsgUnreadNum > 0 && <div style={{marginLeft: 5}}>
                    {newMsgUnreadNum}
                </div>
                }
            </div>}
        </div>
        <div className="chat-content-send-frame">
            <div className="chat-content-send-frame-operation">
                <div style={{display: "flex"}}>
                    <IconMinorButton
                        onClick={(e, r) => {
                            let info = r.current.getBoundingClientRect();
                            setBiaoQingIsPosition({
                                x: info.top - biaoQingPopSize.current.height - 15, y: info.left
                            })
                            setBiaoQingIsShow(true)
                        }}
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
                            ref={msgContentRef}
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

export default memo(CommonChatFrame)