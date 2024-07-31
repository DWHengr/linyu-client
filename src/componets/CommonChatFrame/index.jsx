import "./index.less"
import IconMinorButton from "../IconMinorButton/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import Text from "./ChatContent/Text/index.jsx";
import CustomDragDiv from "../CustomDragDiv/index.jsx";
import {memo, useCallback, useEffect, useRef, useState} from "react";
import {emit, listen} from "@tauri-apps/api/event";
import MessageApi from "../../api/message.js";
import {invoke} from "@tauri-apps/api/core";
import CustomOverlay from "../CustomOverlay/index.jsx";
import {emojis} from "../../utils/emoji.js";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import Time from "./ChatContent/Time/index.jsx";
import {formatTime, getYearDayMonth} from "../../utils/date.js";
import CreateVideoChat from "../../pages/VideoChat/window.jsx";
import VideoApi from "../../api/video.js";
import CreateScreenshot from "../../pages/screenshot/window.jsx";
import {open} from '@tauri-apps/plugin-dialog';
import FileContent from "./ChatContent/File/index.jsx";
import {stat} from "@tauri-apps/plugin-fs";
import {useDispatch} from "react-redux";
import {setFileFileProgress} from "../../store/home/action.js";
import {getFileNameAndType, isImageFile} from "../../utils/string.js";
import Img from "./ChatContent/Img/index.jsx";
import RightClickContent from "../RightClickContent/index.jsx";
import FriendApi from "../../api/friend.js";
import QuillRichTextEditor from "../QuillRichTextEditor/index.jsx";
import RightClickMenu from "../RightClickMenu/index.jsx";
import Retraction from "./ChatContent/Retraction/index.jsx";
import VoiceRecorder from "../VoiceRecorder/index.jsx";
import Voice from "./ChatContent/Voice/index.jsx";
import {getItem, setItem} from "../../utils/storage.js";
import CustomTooltip from "../CustomTooltip/index.jsx";
import CreateImageViewer from "../../pages/ImageViewer/window.jsx";
import Call from "./ChatContent/Call/index.jsx";

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
    const dispatch = useDispatch()
    const isRefresh = useRef(true)
    const [userInfoPosition, setUserInfoPosition] = useState(null)
    const [userDetails, setUserDetails] = useState(null)
    const [editorHtml, setEditorHtml] = useState('')

    //表情
    const [biaoQingIsShow, setBiaoQingIsShow] = useState(false);
    const [biaoQingIsPosition, setBiaoQingIsPosition] = useState({});
    const biaoQingPopSize = useRef({width: 290, height: 140})
    const [scrollDirection, setScrollDirection] = useState('up');
    //用户设置
    const [userSets, SetUserSets] = useState({})
    const [userLocalSets, SetUserLocalSets] = useState({})
    //div可改变resize
    const [height, setHeight] = useState(500);
    const [isResizing, setIsResizing] = useState(false);
    const [startY, setStartY] = useState(0);
    const [startHeight, setStartHeight] = useState(0);

    useEffect(() => {
        const window = WebviewWindow.getCurrent()
        //获取当前用户
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
        })
        //用户设置
        getItem("user-sets").then(value => {
            SetUserSets(value)
        })
        //用户本地相关设置
        getItem("user-local-sets").then(value => {
            SetUserLocalSets(value)
        })
        //监听关闭窗口快捷键
        const unCloseMsgWindow = window.listen('closeMsgWindow', async (event) => {
            const window = WebviewWindow.getCurrent();
            if (window.label !== "home") {
                window.close()
            }
        })
        //监听后端发送的消息
        const unScreenshotListen = window.listen('screenshot_result', async (event) => {
            msgContentRef.current.insertImage('data:image/png;base64,' + event.payload)
        })
        //监听截图快捷键事件
        const unScreenshot = listen('screenshot', async (event) => {
            handlerCreateScreenshot()
        })
        //监听后端发送的消息
        const unListen = listen('on-receive-msg', async (event) => {
            let data = event.payload
            if (data?.msgContent?.type === "retraction") {
                handlerUpdateRetractionMsg(data.id)
                return;
            }
            if (currentToId.current === data.fromId) {
                const window = WebviewWindow.getCurrent()
                let isFocused = await window.isFocused()
                let isMinimized = await window.isMinimized();
                if (isFocused && !isMinimized) {
                    emit("refresh-chat", {id: currentToId.current})
                }
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
        //窗口聚焦
        let unFocus = null;
        if (window.label !== "home") {
            let unFocus = window.listen("tauri://focus", (e) => {
                let fromId = window.label.split('-')[1]
                emit("refresh-chat", {id: fromId})
                e.stopPropagation()
            });
        }
        //窗口聚焦
        let unDrop = window.listen("tauri://drag-drop", (e) => {
            if (!currentToId.current) return
            onSendFile(e.payload.paths[0])
        });
        //监听音视频挂断
        let unHangUp = listen("on-hang-up", (e) => {
            let msg = e.payload
            console.log("e.payload", e.payload)
            if (msg.toUserId === currentToId.current) {
                messagesRef.current.push(msg.data)
                setMessages(() => [...messagesRef.current])
                emit("on-send-msg", {})
            }
        });
        return async () => {
            (await unListen)();
            (await unScreenshotListen)();
            (await unScreenshot)();
            (await unDrop)();
            (await unCloseMsgWindow)();
            (await unHangUp)();
            if (unFocus) (await unFocus)();
        }
    }, [])


    useEffect(() => {
        if (userLocalSets?.sendMsgDivHeight) {
            setHeight(userLocalSets.sendMsgDivHeight)
        } else {
            setHeight(250)
        }
    }, [userLocalSets])

    const handleMouseDown = (e) => {
        setIsResizing(true);
        setStartY(e.clientY);
        setStartHeight(height);
    };

    const handleMouseMove = useCallback((e) => {
        if (!isResizing) return;
        const newHeight = startHeight - (e.clientY - startY);
        setHeight(newHeight);
        setItem("user-local-sets", {...userLocalSets, sendMsgDivHeight: newHeight})
    }, [isResizing, startY, startHeight]);

    const handleMouseUp = () => {
        setIsResizing(false);
    };

    useEffect(() => {
        if (isResizing) {
            window.addEventListener('mousemove', handleMouseMove);
            window.addEventListener('mouseup', handleMouseUp);
        } else {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        }

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing, handleMouseMove]);

    const handlerCreateScreenshot = () => {
        CreateScreenshot(WebviewWindow.getCurrent().label);
    }

    const onSendFile = async (path) => {
        let fileInfo = await stat(path)
        let fileName = path.split('\\').pop();
        let fileType = isImageFile(fileName) ? "img" : "file"
        let msg = {
            toUserId: currentToId.current, msgContent: {
                type: fileType,
                content: JSON.stringify({
                    name: fileName,
                    size: fileInfo.size,
                })
            }
        }

        await MessageApi.sendMsg(msg).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    if (fileType === "file") {
                        messagesRef.current.push(res.data)
                        setMessages(() => [...messagesRef.current])
                        emit("on-send-msg", {})
                    }
                    let sum = 1;
                    MessageApi.sendFile({
                        msgId: res.data.id, path: path,
                    }, (payload) => {
                        sum += payload.progress
                        if (isRefresh.current) {
                            isRefresh.current = false
                            let p = sum / fileInfo.size * 100
                            dispatch(setFileFileProgress(res.data.id, p))
                            setTimeout(function () {
                                isRefresh.current = true
                            }, 1000);
                        }
                        if (sum >= fileInfo.size) {
                            dispatch(setFileFileProgress(res.data.id, 100))
                        }
                    }).then(v => {
                        if (fileType === "img") {
                            messagesRef.current.push(res.data)
                            setMessages(() => [...messagesRef.current])
                            emit("on-send-msg", {})
                        }
                    })
                }
            }
        })

    }

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                WebviewWindow.getCurrent().close()
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [])

    useEffect(() => {
        //滚动条顶部触发加载记录
        const handleScroll = () => {
            //是否到底底部
            const {scrollTop, scrollHeight, clientHeight} = showFrameRef.current;
            const div = showFrameRef.current;
            if (scrollTop + clientHeight + 2 >= scrollHeight) {
                newMsgUnreadNumRef.current = 0
                setNewMsgUnreadNum(newMsgUnreadNumRef.current)
            }

            //是否触发顶部获取记录
            if (isQueryComplete.current) return
            if (showFrameRef.current && !scrollTriggered.current) {
                if (0 === scrollTop) {
                    scrollTriggered.current = true
                    onMessageRecord()
                }
            }
            //获取滚动条方向
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
                messagesRef.current = [...res.data, ...messagesRef.current]
                setMessages(messagesRef.current)
                if (res.data.length > 0) {
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
        setEditorHtml("")
        userInfoRef.current = userInfo
        //会话切换，重置
        isQueryComplete.current = false
        currentMsgRecordIndex.current = 0
        scrollTriggered.current = false
        messagesRef.current = []
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

    const onUploadImg = (img) => {
        const base64Data = img.split(',')[1];
        const contentType = img.split(',')[0].split(':')[1].split(';')[0];
        const byteCharacters = atob(base64Data);
        const byteNumbers = new Array(byteCharacters.length);
        for (let i = 0; i < byteCharacters.length; i++) {
            byteNumbers[i] = byteCharacters.charCodeAt(i);
        }
        const byteArray = new Uint8Array(byteNumbers);
        const blob = new Blob([byteArray], {type: contentType});
        return new File([blob], 'img.png', {type: contentType});
    }

    let onSendMsg = () => {
        const {isNull, data} = msgContentRef.current?.getContent()
        if (isNull || (data.length <= 0)) return
        data?.map(item => {
            if (item.type === 'text') {
                let msg = {
                    toUserId: currentToId.current, msgContent: {
                        type: "text", content: item.text
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
            }
            if (item.type === 'img') {
                let file = onUploadImg(item.url)
                let msg = {
                    toUserId: currentToId.current, msgContent: {
                        type: "img",
                        content: JSON.stringify({
                            name: file.name,
                            size: file.size,
                        })
                    }
                }
                MessageApi.sendMsg(msg).then(res => {
                    if (res.code === 0) {
                        if (res.data) {
                            MessageApi.sendMedia(file, {
                                msgId: res.data.id
                            }).then(v => {
                                messagesRef.current.push(res.data)
                                setMessages(() => [...messagesRef.current])
                                emit("on-send-msg", {})
                            })
                        }
                    }
                })
            }
        })
        setEditorHtml("")
    }

    const onSendVoice = (audioBlob, time) => {
        const audioFile = new File([audioBlob], 'voice.wav', {type: 'audio/wav'});
        let msg = {
            toUserId: currentToId.current, msgContent: {
                type: "voice",
                content: JSON.stringify({
                    name: audioFile.name,
                    size: audioFile.size,
                    time: time,
                })
            }
        }
        MessageApi.sendMsg(msg).then(res => {
            if (res.code === 0) {
                if (res.data) {
                    MessageApi.sendMedia(audioFile, {
                        msgId: res.data.id
                    }).then(v => {
                        messagesRef.current.push(res.data)
                        setMessages(() => [...messagesRef.current])
                        emit("on-send-msg", {})
                    })
                }
            }
        })
    }

    const onContentKeyDown = (event) => {
        getItem("user-sets").then(value => {
            if (event.key === 'Enter' && event.altKey && value.sendMsgShortcut === "Alt + Enter") {
                event.preventDefault()
                onSendMsg()
            }
            if (event.key === 'Enter' && value.sendMsgShortcut === "Enter") {
                event.preventDefault()
                onSendMsg()
            }
        })
    };

    const onVideo = (isOnlyAudio) => {
        CreateVideoChat(currentToId.current, true, isOnlyAudio)
        VideoApi.invite({userId: currentToId.current, isOnlyAudio: isOnlyAudio})
    }

    const handleOpenFile = async () => {
        const selected = await open({
            multiple: true,
        });
        if (Array.isArray(selected)) {
            onSendFile(selected[0].path)
        }
    }

    const onUserDetails = (e) => {
        FriendApi.details(userInfo.fromId).then(res => {
            if (res.code === 0) {
                setUserDetails(res.data)
            }
        })
        setUserInfoPosition({x: e.clientX, y: e.clientY})
    }

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
                                msgContentRef.current.insertEmojiOrText(emoji);
                                setBiaoQingIsShow(false)
                            }}
                            className="biao-qing" key={index}>
                            {emoji}
                        </div>)
                    })}
                </div>
            </CustomOverlay>
        </div>)
    }

    const handleMsgContent = (msg) => {
        let isRight = msg.fromId === currentUserId.current
        switch (msg.msgContent?.type) {
            case "text": {
                return <Text
                    value={msg.msgContent?.content}
                    right={isRight}
                />
            }
            case "file": {
                return <FileContent
                    value={msg}
                    right={isRight}
                />
            }
            case "img": {
                return <Img
                    value={msg}
                    right={isRight}
                />
            }
            case "retraction": {
                return <Retraction
                    value={msg}
                    onReedit={onReedit}
                    right={isRight}
                />
            }
            case "voice": {
                return <Voice
                    value={msg}
                    right={isRight}
                />
            }
            case "call": {
                return <Call
                    value={msg}
                    right={isRight}
                />
            }
        }
    }

    const msgContentRightOptions = [
        {key: "copy", label: "复制"},
        {key: "retraction", label: "撤回"}
    ]
    const [msgContentRightFilterOptions, setMsgContentRightFilterOptions] = useState([])
    const [msgContentMenuPosition, setMsgContentMenuPosition] = useState(null)
    const currentRightSelectMsgRef = useRef()

    const onReedit = (msg) => {
        MessageApi.reedit({msgId: msg.id}).then(res => {
            if (res.code === 0) {
                msgContentRef.current.insertEmojiOrText(res.data?.msgContent?.content)
            }
        })
    }

    const handlerRightSelectMsgContent = (e, msg) => {
        if (msg.msgContent.type === "retraction") return
        currentRightSelectMsgRef.current = msg
        let filter = [""]
        if (msg.msgContent.type !== 'text') filter.push("copy")
        if (msg.fromId !== currentUserId.current) filter.push("retraction")
        setMsgContentRightFilterOptions(filter)
        setMsgContentMenuPosition({x: e.clientX, y: e.clientY})
    }

    const handlerUpdateRetractionMsg = (msgId) => {
        for (let i = messagesRef.current.length - 1; i >= 0; i--) {
            let msg = messagesRef.current[i]
            if (msg.id === msgId) {
                messagesRef.current[i].type = msg.msgContent.type
                messagesRef.current[i].msgContent.type = "retraction"
                messagesRef.current[i].msgContent.content = ""
                break
            }
        }
        scrollTriggered.current = true
        setMessages(() => [...messagesRef.current])
        emit("on-send-msg", {})
    }

    const onMsgContentClick = (action) => {
        switch (action.key) {
            case "copy": {
                break
            }
            case "retraction": {
                MessageApi.retraction({msgId: currentRightSelectMsgRef.current.id}).then(res => {
                    if (res.code === 0) {
                        handlerUpdateRetractionMsg(currentRightSelectMsgRef.current.id)
                    }
                })
                break
            }
        }
    }

    return (<div className="common-chat-content">
        <BiaoQingPop/>
        <RightClickMenu
            position={msgContentMenuPosition}
            options={msgContentRightOptions}
            width={70}
            filter={msgContentRightFilterOptions}
            onMenuItemClick={onMsgContentClick}
        />
        <RightClickContent position={userInfoPosition}>
            <div className="user-details">
                <div className="user-details-title">
                    <div style={{display: "flex", alignItems: "center", userSelect: "none"}}>
                        <img src="/id.png" style={{width: 30, height: 30}}/>
                        <div style={{marginLeft: 5, fontWeight: 600}}>林语用户证明</div>
                    </div>
                    <div style={{display: "flex", alignItems: "center"}}>
                        <i className={`iconfont ${userDetails?.sex === '女' ? 'icon-nv' : 'icon-nan'}`}
                           style={{
                               marginRight: 5,
                               color: userDetails?.sex === '女' ? "#FFA0CF" : "#4C9BFF"
                           }}/>
                        <div>{userDetails?.account}</div>
                    </div>
                </div>
                <div className="user-details-content">
                    <img
                        src={userDetails?.portrait}
                        style={{width: 80, height: 80, borderRadius: 80}}
                        onClick={() => {
                            CreateImageViewer(getFileNameAndType(userDetails.portrait).fileName, userDetails.portrait)
                        }}
                    />
                    <div style={{marginLeft: 15}}>
                        <div className="item">
                            <div className="item-label">姓名 / Name</div>
                            <div className="item-value">
                                {userDetails?.name}
                            </div>
                        </div>
                        <div className="item">
                            <div className="item-label">备注 / Remark</div>
                            <div className="item-value">{userDetails?.remark}</div>
                        </div>
                        <div className="item">
                            <div className="item-label">生日 / Birthday</div>
                            <div className="item-value">{getYearDayMonth(userDetails?.birthday)}</div>
                        </div>
                        <div className="item">
                            <div className="item-label">签名 / Signature</div>
                            <div className="item-value two-line"
                            >{userDetails?.signature}</div>
                        </div>
                    </div>
                </div>
            </div>
        </RightClickContent>
        <CustomDragDiv className="chat-content-title">
            <img
                style={{
                    width: 40, height: 40, backgroundColor: "#4C9BFF", borderRadius: 50, marginLeft: 10
                }}
                src={userInfo.portrait}
                alt={userInfo.portrait}
                onClick={onUserDetails}
            />
            <div style={{
                fontWeight: 600, color: "#1F1F1F", marginLeft: 10,
            }}>
                {userInfo.remark ? userInfo.remark : userInfo.name}
            </div>
        </CustomDragDiv>
        <div ref={showFrameRef} className="chat-content-show-frame">
            {messages?.map((msg) => {
                return (<div key={msg.id}>
                    {msg.isShowTime && <Time value={formatTime(msg.updateTime)}/>}
                    <div onContextMenu={(e) => handlerRightSelectMsgContent(e, msg)}>
                        {handleMsgContent(msg)}
                    </div>
                </div>)
            })}
            {newMsgUnreadNum !== 0 &&
                <div className="hint"
                     onClick={onScrollToBottom}
                     style={{bottom: height + 15}}
                >
                    <i className={`iconfont icon icon-xiala`} style={{fontSize: 12}}/>
                    {newMsgUnreadNum > 0 && <div style={{marginLeft: 5}}>
                        {newMsgUnreadNum}
                    </div>}
                </div>}
        </div>
        <div
            className="chat-content-send-frame"
            style={{height: height}}
        >
            <div
                className="resize-handle"
                onMouseDown={handleMouseDown}
            />
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
                        icon={<i className={`iconfont icon icon-biaoqing`} style={{fontSize: 24}}/>}
                        title="表情"
                    />
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-wenjian`} style={{fontSize: 26}}/>}
                        onClick={handleOpenFile}
                        title="文件"
                    />
                    {/*<IconMinorButton*/}
                    {/*    icon={<i className={`iconfont icon icon-jilu`} style={{fontSize: 22}}/>}*/}
                    {/*    title="聊天记录"*/}
                    {/*/>*/}
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-jietu`} style={{fontSize: 18}}/>}
                        onClick={handlerCreateScreenshot}
                        title={`截图 ${userSets.screenshot}`}
                    />
                </div>
                <div style={{display: "flex"}}>
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-dianhua`} style={{fontSize: 24}}/>}
                        onClick={() => onVideo(true)}
                        title="电话"
                    />
                    <IconMinorButton
                        icon={<i className={`iconfont icon icon-shipin`} style={{fontSize: 26}}/>}
                        onClick={() => onVideo(false)}
                        title="视频"
                    />
                </div>
            </div>
            <div className="chat-content-send-frame-msg">
                <QuillRichTextEditor
                    ref={msgContentRef}
                    value={editorHtml}
                    onChange={(v) => setEditorHtml(v)}
                    onKeyDown={(e) => onContentKeyDown(e)}
                />
                {/*<textarea*/}
                {/*    ref={msgContentRef}*/}
                {/*    onKeyDown={(e) => onContentKeyDown(e)}*/}
                {/*>*/}
                {/*</textarea>*/}
                {/*<RichTextEditor ref={msgContentRef} onKeyDown={(e) => onContentKeyDown(e)}/>*/}
            </div>
            <div className="chat-content-send-frame-operation-bottom">
                <CustomTooltip placement="top" title="语音消息">
                    <VoiceRecorder onComplete={onSendVoice}/>
                </CustomTooltip>
                <CustomTooltip placement="top" title={userSets.sendMsgShortcut}>
                    <CustomButton width={40} onClick={onSendMsg}>
                        发送
                    </CustomButton>
                </CustomTooltip>
            </div>
        </div>
    </div>)
}

export default memo(CommonChatFrame)