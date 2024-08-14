import "./index.less"
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import FocusLock from 'react-focus-lock';
import {useToast} from "../../componets/CustomToast/index.jsx";
import FriendApi from "../../api/friend.js";
import CustomEmpty from "../../componets/CustomEmpty/index.jsx";
import Time from "../../componets/CommonChatFrame/ChatContent/Time/index.jsx";
import {formatTime} from "../../utils/date.js";
import {MsgContent} from "../../componets/CommonChatFrame/ChatContent/MsgContent/index.jsx";
import {invoke} from "@tauri-apps/api/core";
import MessageApi from "../../api/message.js";
import {emit, listen} from "@tauri-apps/api/event";
import ChatListApi from "../../api/chatList.js";
import {useDispatch, useSelector} from "react-redux";
import CreateChatWindow from "../ChatWindow/window.jsx";
import {addChatWindowUser} from "../../store/chat/action.js";

export default function Command() {
    const currentUserId = useRef(null)
    const cmdIndexRef = useRef(1)
    const [cmdIndex, setCmdIndex] = useState(1)
    const [cmdOne, setCmdOne] = useState("")
    const [cmdTwo, setCmdTwo] = useState(null)
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef(null);
    const [placeholder, setPlaceholder] = useState("")
    const showToast = useToast()
    const [friendList, setFriendList] = useState([])
    const showFrameRef = useRef(null)
    const isQueryComplete = useRef(false)
    const [messages, setMessages] = useState([])
    const messagesRef = useRef([])//保持会话的消息
    const userInfoRef = useRef(null)
    const currentMsgRecordIndex = useRef(0)//消息记录查询的索引
    const chatStoreData = useSelector((state) => state.chatData);
    const dispatch = useDispatch();

    const cmdOneList = [{
        key: 'send', describe: '发送 消息给用户~'
    }, {
        key: 'open', describe: '打开 用户聊天窗口~'
    }]


    useEffect(() => {
        //获取当前用户
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
        })
        const handleEscKey = (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                WebviewWindow.getCurrent().hide()
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [])

    useEffect(() => {
        const unListen = listen('on-receive-msg', async (event) => {
            let data = event.payload
            onListFlatUnread()
            if (cmdIndexRef.current === 3 && data.fromId === userInfoRef.current.friendId) {
                onRead(userInfoRef.current.friendId)
                messagesRef.current = [data, ...messagesRef.current]
                setMessages(messagesRef.current)
            }
        });
        return async () => {
            (await unListen)();
        }
    }, [])

    useEffect(() => {
        //滚动条顶部触发加载记录
        const handleScroll = () => {
            const {scrollTop, scrollHeight, clientHeight} = showFrameRef.current;
            //是否触发顶部获取记录
            if (showFrameRef.current) {
                if (scrollHeight - (scrollTop + clientHeight) < 1) {
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
    }, []);

    const onMessageRecord = () => {
        if (isQueryComplete.current) return
        //获取消息记录
        MessageApi.recordDesc({
            targetId: userInfoRef.current.friendId, index: currentMsgRecordIndex.current, num: 20
        }).then(res => {
            if (res.code === 0) {
                messagesRef.current = [...messagesRef.current, ...res.data]
                setMessages(messagesRef.current)
                if (res.data.length > 0) {
                    currentMsgRecordIndex.current += 20
                } else {
                    isQueryComplete.current = true
                }
            }
        })
    }

    const onListFlatUnread = () => {
        FriendApi.listFlatUnread({friendInfo: inputValue?.trim()}).then(res => {
            if (res.code === 0) {
                setFriendList(res.data)
            }
        })
    }
    const onSendMsg = (text) => {
        let msg = {
            toUserId: userInfoRef.current.friendId, msgContent: {
                type: "text", content: text
            },
        }
        MessageApi.sendMsg(msg).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    messagesRef.current = [res.data, ...messagesRef.current]
                    setMessages(messagesRef.current)
                    emit("on-send-msg", {})
                }
            }
        })
    }

    const onGetChatList = () => {
        ChatListApi.list().then(res => {
            if (res.code === 0) {
                emit("chat-list", [...res.data.tops, ...res.data.others])
            }
        })
    }
    const onRead = (id) => {
        if (!id || id.length <= 0) return
        ChatListApi.read(id).then(() => {
            onGetChatList()
            emit("on-unread-info", {})
        })
    }

    const handlerCmdOne = (cmd) => {
        cmd = cmd?.trim()
        for (let i = 0; i < cmdOneList.length; i++) {
            if (cmdOneList[i].key === cmd) {
                setCmdOne(cmd)
                cmdIndexRef.current = 2
                inputRef.current.focus()
                onListFlatUnread()
                return
            }
        }
        showToast(`[ ${cmd} ]命令不存在~`, true)
    }

    const handlerCmdTwo = (user) => {
        user = user?.trim()
        for (let i = 0; i < friendList.length; i++) {
            let friendInfo = friendList[i]
            if (friendInfo.name === user || friendInfo.remark === user || friendInfo.account === user) {
                if (cmdOne === "send") {
                    setCmdTwo(friendInfo)
                    userInfoRef.current = friendInfo
                    cmdIndexRef.current = 3
                    inputRef.current.focus()
                }
                if (cmdOne === "open") {
                    emit("chat-new", {
                        fromId: friendInfo.friendId, remark: friendInfo.remark, name: friendInfo.name
                    })
                }
                return
            }
        }
        showToast(`[ ${user} ] 好友不存在~`, true)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            switch (cmdIndexRef.current) {
                case 1: {
                    handlerCmdOne(inputValue)
                    break
                }
                case 2: {
                    handlerCmdTwo(inputValue)
                    break
                }
                case 3: {
                    onSendMsg(inputValue)
                    setInputValue("")
                    break
                }
            }
        }
        if (event.key === 'Backspace') {
            if (!inputValue && cmdIndexRef.current > 1) {
                cmdIndexRef.current = cmdIndexRef.current - 1
                switch (cmdIndexRef.current) {
                    case 1: {
                        setCmdOne("")
                        setInputValue("")
                        break
                    }
                    case 2: {
                        setCmdTwo("")
                        setInputValue("")
                        onListFlatUnread()
                        break
                    }
                }
            }
        }
    }

    useEffect(() => {
        setCmdIndex(cmdIndexRef.current)
        setInputValue("")
        switch (cmdIndexRef.current) {
            case 1: {
                setCmdOne("")
                setPlaceholder("请输入命令~")
                break
            }
            case 2: {
                setCmdTwo(null)
                setPlaceholder("请输入用户名/备注/账号~")
                break
            }
            case 3: {
                setPlaceholder("请输入发送的消息~")
                break
            }
        }
    }, [cmdIndexRef.current])

    useEffect(() => {
        if (cmdIndexRef.current === 2) {
            onListFlatUnread()
        }
    }, [inputValue])

    useEffect(() => {
        if (cmdTwo && showFrameRef.current) {
            currentMsgRecordIndex.current = 0
            messagesRef.current = []
            isQueryComplete.current = false
            onRead(userInfoRef.current.friendId)
            onMessageRecord()
        }
    }, [cmdTwo])

    return (<div className="command-window-container">
            <FocusLock>
                <CustomDragDiv className="command-window">
                    <CustomDragDiv className="command-box">
                        {cmdOne && <div className="command-one">
                            {cmdOne}
                        </div>}
                        {cmdTwo && <div className="command-two">
                            {cmdTwo.remark ? cmdTwo.remark : cmdTwo.name}
                        </div>}
                        <div className="command-input">
                            <input
                                ref={inputRef}
                                placeholder={placeholder}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <img data-tauri-drag-region alt="" src="/logo.png"
                             style={{width: 55, height: 55, marginLeft: 5, flexShrink: 0}}/>
                    </CustomDragDiv>
                    <CustomDragDiv className="content">
                        {cmdIndex === 1 && <div>
                            {cmdOneList?.map((item, index) => {
                                return <div
                                    key={index} className="cmd-item"
                                    tabIndex="0"
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') handlerCmdOne(item.key)
                                    }}
                                    onClick={() => handlerCmdOne(item.key)}
                                >
                                    <div style={{
                                        fontSize: 24, marginRight: 10, fontWeight: 600
                                    }}>{item.key}</div>
                                    <div style={{fontSize: 14, lineHeight: '14px'}}>{item.describe}</div>
                                </div>
                            })}
                        </div>}
                        {cmdIndex === 2 && <CustomDragDiv style={{height: '100%', overflowY: "scroll"}}>
                            {friendList?.map((item, index) => {
                                return <div
                                    key={index} className="cmd-item"
                                    tabIndex="0"
                                    onKeyDown={(event) => {
                                        if (event.key === 'Enter') handlerCmdTwo(item.name)
                                    }}
                                    onClick={() => handlerCmdTwo(item.name)}
                                >
                                    <img alt="" src={item.portrait}
                                         style={{width: 45, height: 45, borderRadius: 45, marginRight: 10,}}/>
                                    <div style={{
                                        fontSize: 24,
                                        marginRight: 10,
                                        fontWeight: 600,
                                        display: "flex",
                                        alignItems: "center",
                                    }}>
                                        {item.remark ? item.remark : item.name}
                                        <div style={{
                                            fontSize: 14, lineHeight: '14px'
                                        }}>({item.account})
                                        </div>
                                    </div>
                                    <div style={{
                                        fontSize: 14, lineHeight: '14px', marginRight: 10,
                                    }}>{item.name}</div>
                                    {item?.unreadNum > 0 && <div style={{
                                        marginLeft: "auto", display: "flex", alignItems: "center"
                                    }}>
                                        <div style={{fontSize: 14, marginRight: 10}}>未读消息:</div>
                                        <div style={{
                                            width: 25,
                                            height: 25,
                                            borderRadius: 25,
                                            backgroundColor: "#4C9BFF",
                                            color: "#fff",
                                            fontSize: 14,
                                            fontWeight: 600,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center"
                                        }}>
                                            {item.unreadNum}
                                        </div>
                                    </div>}
                                </div>
                            })}
                            {friendList?.length <= 0 && <div style={{userSelect: "none", marginTop: 20}}>
                                <CustomEmpty placeholder="好友搜索结果为空~"/>
                            </div>}
                        </CustomDragDiv>}
                        <div ref={showFrameRef} className="chat-content">
                            {cmdIndex === 3 && <div className="chat-content-show-frame">
                                {messages?.map((msg) => {
                                    return (<div key={msg.id}>
                                        <div>
                                            <MsgContent msg={msg} userId={currentUserId.current}/>
                                        </div>
                                        {msg.isShowTime && <Time value={<div>
                                            <i className={`iconfont icon-xiangshang`}
                                               style={{fontSize: 10, marginRight: 2, color: "#737373"}}/>
                                            {formatTime(msg.updateTime)}
                                        </div>}/>}
                                    </div>)
                                })}
                            </div>}
                        </div>
                    </CustomDragDiv>
                </CustomDragDiv>
            </FocusLock>
        </div>)
}