import "./index.less"
import IconMinorButton from "../IconMinorButton/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import CustomDragDiv from "../CustomDragDiv/index.jsx";
import React, {memo, useCallback, useEffect, useRef, useState} from "react";
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
import {stat} from "@tauri-apps/plugin-fs";
import {useDispatch} from "react-redux";
import {setFileFileProgress} from "../../store/home/action.js";
import {getFileNameAndType, isImageFile} from "../../utils/string.js";
import RightClickContent from "../RightClickContent/index.jsx";
import FriendApi from "../../api/friend.js";
import QuillRichTextEditor from "../QuillRichTextEditor/index.jsx";
import RightClickMenu from "../RightClickMenu/index.jsx";
import VoiceRecorder from "../VoiceRecorder/index.jsx";
import {getItem, setItem} from "../../utils/storage.js";
import CustomTooltip from "../CustomTooltip/index.jsx";
import CreateImageViewer from "../../pages/ImageViewer/window.jsx";
import {MsgContent} from "./ChatContent/MsgContent/index.jsx";
import ChatGroupMemberApi from "../../api/chatGroupMember.js";
import CustomDrawer from "../CustomDrawer/index.jsx";
import ChatGroupApi from "../../api/chatGroup.js";
import CustomEditableText from "../CustomEditableText/index.jsx";
import CustomSearchInput from "../CustomSearchInput/index.jsx";
import CustomModal from "../CustomModal/index.jsx";
import ChatGroupInvite from "../ChatGroupInvite/index.jsx";
import Dropzone from "react-dropzone";
import CustomAffirmModal from "../CustomAffirmModal/index.jsx";
import CreateChatGroupNotice from "../../pages/ChatGroupNotice/window.jsx";

function CommonChatFrame({chatInfo}) {

    const [messages, setMessages] = useState([])
    const showFrameRef = useRef(null)
    const currentToId = useRef(chatInfo.fromId)//消息目标用户
    const msgContentRef = useRef(null)//输入框消息内容
    const messagesRef = useRef([])//保持会话的消息
    const currentUserId = useRef(null)//当前用户
    const currentMsgRecordIndex = useRef(0)//消息记录查询的索引
    const scrollTriggered = useRef(false) //滚动条是否触发
    const isQueryComplete = useRef(false) //消息记录是否全部加载
    const userInfoRef = useRef(chatInfo)
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
    const [chatGroupMemberList, setChatGroupMemberList] = useState([])
    const [chatGroupInfoOpen, setChatGroupInfoOpen] = useState(false)
    const [groupDetails, setGroupDetails] = useState(null)
    const [chatGroupInviteOpen, setChatGroupInviteOpen] = useState(false)
    const [isChatGroupQuitAffirmModalOpen, setIsChatGroupQuitAffirmModalOpen] = useState(false)

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
            if (currentToId.current === data.fromId || (data.source === 'group' && currentToId.current === data.toId)) {
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
                let fromId = window.label.split('--')[1]
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
                type: fileType, source: chatInfo.type, content: JSON.stringify({
                    name: fileName, size: fileInfo.size,
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
                const window = WebviewWindow.getCurrent();
                if (window.label !== "home") {
                    window.close()
                } else {
                    window.hide()
                }
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
                    scrollTriggered.current = true
                    isQueryComplete.current = true
                }
            }
        })
    }

    const onChatGroupMemberList = () => {
        ChatGroupMemberApi.list({chatGroupId: chatInfo.fromId}).then(res => {
            if (res.code === 0) {
                setChatGroupMemberList(res.data)
            }
        })
    }

    useEffect(() => {
        setEditorHtml("")
        userInfoRef.current = chatInfo
        //会话切换，重置
        isQueryComplete.current = false
        currentMsgRecordIndex.current = 0
        scrollTriggered.current = false
        messagesRef.current = []
        currentToId.current = chatInfo.fromId
        const container = showFrameRef.current
        container.scrollTop = container.scrollHeight
        onMessageRecord()
        if (chatInfo.type === 'group') {
            onChatGroupMemberList()
            onGroupDetails()
        }
    }, [chatInfo])

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
                    toUserId: currentToId.current, source: chatInfo.type, msgContent: {
                        type: "text", content: item.text
                    }
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
                    toUserId: currentToId.current,
                    source: chatInfo.type,
                    msgContent: {
                        type: "img", content: JSON.stringify({
                            name: file.name, size: file.size,
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
            toUserId: currentToId.current, source: chatInfo.type, msgContent: {
                type: "voice", content: JSON.stringify({
                    name: audioFile.name, size: audioFile.size, time: time,
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
        FriendApi.details(chatInfo.fromId).then(res => {
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

    const msgContentRightOptions = [{key: "copy", label: "复制"}, {
        key: "retraction",
        label: "撤回"
    }, {key: "voiceToText", label: "语音转文字"}]
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
        if (msg.msgContent.type !== 'voice') filter.push("voiceToText")
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

    const handlerUpdateVoiceToTextMsg = (newMsg) => {
        let isExist = false
        let i = 0
        for (i = messagesRef.current.length - 1; i >= 0; i--) {
            let msg = messagesRef.current[i]
            if (msg.id === newMsg.id) {
                messagesRef.current[i] = newMsg
                messagesRef.current[i].loading = false
                isExist = true
                break
            }
        }
        scrollTriggered.current = !(i === messagesRef.current.length - 1 && isExist);
        setMessages(() => [...messagesRef.current])
    }

    const handlerLoadingMsg = (msgId) => {
        let isExist = false
        let i = 0
        for (i = messagesRef.current.length - 1; i >= 0; i--) {
            let msg = messagesRef.current[i]
            if (msg.id === msgId) {
                messagesRef.current[i] = JSON.parse(JSON.stringify(msg))
                messagesRef.current[i].loading = true
                isExist = true
                break
            }
        }
        scrollTriggered.current = !(i === messagesRef.current.length - 1 && isExist);
        setMessages(() => [...messagesRef.current])
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
            case "voiceToText": {
                for (let i = messagesRef.current.length - 1; i >= 0; i--) {
                    let msg = messagesRef.current[i]
                    if (msg.id === currentRightSelectMsgRef.current.id) {
                        if (msg.loading) {
                            return true
                        }
                    }
                }
                handlerLoadingMsg(currentRightSelectMsgRef.current.id)
                MessageApi.voiceToText({msgId: currentRightSelectMsgRef.current.id}).then(res => {
                    if (res.code === 0) {
                        handlerUpdateVoiceToTextMsg(res.data)
                    }
                })
                break
            }
        }
    }

    const onGroupDetails = () => {
        ChatGroupApi.details({chatGroupId: chatInfo.fromId}).then(res => {
            if (res.code === 0) {
                setGroupDetails(res.data)
            }
        })
    }

    const handlerGroupDisplayName = (member, msg) => {
        if (!member) {
            return msg?.msgContent?.formUserName
        }
        if (member.groupName) {
            return member.groupName;
        } else if (member.remark) {
            return member.remark;
        } else {
            return member.name;
        }
    };

    const handlerGroupDisplayPortrait = (member, msg) => {
        if (!member) {
            return msg?.msgContent?.formUserPortrait
        }
        return member?.portrait
    };

    const onGroupAvatarChange = (file) => {
        ChatGroupApi.uploadPortrait(file, {groupId: groupDetails?.id}).then(res => {
            if (res.code === 0) {
                setGroupDetails({...groupDetails, portrait: res.data})
            }
        })
    }

    const onUpdateChatGroupName = (value) => {
        ChatGroupApi.updateGroupName({groupId: groupDetails?.id, name: value}).then(res => {
            if (res.code === 0) {
                setGroupDetails({...groupDetails, portrait: res.data})
            }
        })
    }

    const onUpdateChatGroup = (key, value) => {
        ChatGroupApi.update({groupId: groupDetails?.id, updateKey: key, updateValue: value}).then(res => {
            if (res.code === 0) {
                onGroupDetails()
            }
        })
    }

    const onInviteMember = (userIds) => {
        if (!userIds || userIds.length <= 0) return
        ChatGroupApi.invite({groupId: groupDetails?.id, userIds: userIds}).then(res => {
            if (res.code === 0) {
                onChatGroupMemberList()
                onGroupDetails()
                setChatGroupInviteOpen(false)
            }
        })
    }

    const onQuitChatGroup = () => {
        ChatGroupApi.quit({groupId: groupDetails?.id}).then(res => {
            if (res.code === 0) {
                emit("chat-list-delete")
            }
        })
    }

    return (<div className="common-chat-content">
        <BiaoQingPop/>
        {
            chatInfo.type === 'group' &&
            <CustomModal isOpen={chatGroupInviteOpen}>
                <ChatGroupInvite
                    onOk={(userIds) => onInviteMember(userIds)}
                    onCancel={() => setChatGroupInviteOpen(false)}
                    existing={chatGroupMemberList}
                />
            </CustomModal>
        }
        <RightClickMenu
            position={msgContentMenuPosition}
            options={msgContentRightOptions}
            width={90}
            filter={msgContentRightFilterOptions}
            onMenuItemClick={onMsgContentClick}
        />
        <CustomAffirmModal
            isOpen={isChatGroupQuitAffirmModalOpen}
            txt="确认退出该群?"
            onOk={onQuitChatGroup}
            onCancel={() => setIsChatGroupQuitAffirmModalOpen(false)}
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
                               marginRight: 5, color: userDetails?.sex === '女' ? "#FFA0CF" : "#4C9BFF"
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
        <CustomDrawer isOpen={chatGroupInfoOpen} onClose={() => setChatGroupInfoOpen(false)}>
            <div className="chat-group-drawer">
                <div className="chat-group-portrait-info">
                    {groupDetails?.ownerUserId === currentUserId.current && <Dropzone
                        onDrop={(acceptedFiles) => onGroupAvatarChange(acceptedFiles[0])}
                        accept={
                            {
                                'image/*': ['.png'],
                            }
                        }
                    >
                        {({getRootProps, getInputProps}) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="portrait-info">
                                    <img style={{width: 50, height: 50, borderRadius: 50}}
                                         src={groupDetails?.portrait}
                                         alt=""
                                    />
                                    <div className="portrait-info-cover">
                                        <i className={`iconfont icon-xiangji`}
                                           style={{color: "#fff", fontSize: 20}}/>
                                    </div>

                                </div>
                            </div>
                        )}
                    </Dropzone>
                    }
                    {groupDetails?.ownerUserId !== currentUserId.current &&
                        <img style={{width: 50, height: 50, borderRadius: 50}}
                             src={groupDetails?.portrait}
                             alt=""
                             onClick={() => {
                                 getFileNameAndType(groupDetails?.portrait)
                                 CreateImageViewer("group." + getFileNameAndType(groupDetails?.portrait).fileType, groupDetails.portrait)
                             }}
                        />
                    }
                    <div style={{fontWeight: 600, marginLeft: 5}}>
                        {groupDetails?.name}
                    </div>
                    <div style={{marginLeft: "auto"}}>
                        <CustomButton
                            width={30}
                            type='error'
                            style={{fontSize: 12}}
                            onClick={() => setIsChatGroupQuitAffirmModalOpen(true)}
                        >
                            退出
                        </CustomButton>
                    </div>
                </div>
                <div className="chat-group-drawer-item">
                    <div className="item-label">群聊名称</div>
                    <CustomEditableText
                        readOnly={currentUserId.current !== groupDetails?.ownerUserId}
                        style={{
                            color: "#969696",
                            fontSize: 14,
                            backgroundColor: '#fff',
                            borderRadius: 5
                        }}
                        placeholder="群聊名称"
                        text={groupDetails?.name}
                        onSave={(v) => onUpdateChatGroupName(v)}
                    />
                </div>
                <div className="chat-group-drawer-item">
                    <div className="item-label">备注</div>
                    <CustomEditableText
                        style={{
                            color: "#969696",
                            fontSize: 14,
                            backgroundColor: '#fff',
                            borderRadius: 5
                        }}
                        placeholder="群聊的备注，仅自己可见"
                        text={groupDetails?.groupRemark}
                        onSave={(v) => onUpdateChatGroup('group_remark', v)}
                    />
                </div>
                <div className="chat-group-drawer-item">
                    <div className="item-label">本群昵称</div>
                    <CustomEditableText
                        style={{
                            color: "#969696",
                            fontSize: 14,
                            backgroundColor: '#fff',
                            borderRadius: 5
                        }}
                        placeholder="设置本群昵称"
                        text={groupDetails?.groupName}
                        onSave={(v) => onUpdateChatGroup('group_name', v)}
                    />
                </div>
                <div className="chat-group-drawer-item">
                    <div className="item-label">群公告</div>
                    <div
                        style={{
                            color: "#969696",
                            fontSize: 14,
                            backgroundColor: '#fff',
                            borderRadius: 5,
                            padding: 5,
                            display: "flex",
                            cursor: "pointer"
                        }}
                        onClick={() => CreateChatGroupNotice(groupDetails?.id)}
                    >
                        <div>
                            {groupDetails?.notice?.noticeContent ? groupDetails.notice.noticeContent : "群公告暂未设置"}
                        </div>
                        <div style={{marginLeft: "auto"}}>
                            <i className={`iconfont icon icon-weixiala`} style={{fontSize: 14}}/>
                        </div>
                    </div>
                </div>
                <div className="chat-group-member-list">
                    <div className="item-label">
                        <div>群成员({groupDetails?.memberNum})</div>
                        <IconMinorButton
                            onClick={() => {
                                setChatGroupInfoOpen(false)
                                setChatGroupInviteOpen(true)
                            }}
                            icon={<i className={`iconfont icon-yaoqing`} style={{fontSize: 22}}/>}
                        />
                    </div>
                    <CustomSearchInput
                        style={{marginTop: 4, marginBottom: 4, border: '#FFF 2px solid', height: 30}}
                        placeholder="搜索成员"
                        value=""
                    />
                    <div className="member">
                        {
                            Object.entries(chatGroupMemberList).map(([userId, member]) => {
                                return (
                                    <div key={userId} className="member-item">
                                        <img alt=""
                                             src={member.portrait}
                                             className="item-portrait"
                                        />
                                        <div className="item-name">
                                            {handlerGroupDisplayName(member)}
                                        </div>
                                    </div>
                                )
                            })
                        }
                    </div>
                </div>
            </div>
        </CustomDrawer>
        <CustomDragDiv className="chat-content-title">
            <img
                style={{
                    width: 40, height: 40, backgroundColor: "#4C9BFF", borderRadius: 50, marginLeft: 10
                }}
                src={chatInfo.portrait}
                alt={chatInfo.portrait}
                onClick={(e) => {
                    if (chatInfo.type === 'group') {
                        setChatGroupInfoOpen(true)
                        onGroupDetails()
                    } else {
                        onUserDetails(e)
                    }
                }}
            />
            <CustomDragDiv style={{
                fontWeight: 600, color: "#1F1F1F", marginLeft: 10,
            }}>
                {chatInfo.remark ? chatInfo.remark : chatInfo.name}
                {chatInfo.type === 'group' && <span>({Object.entries(chatGroupMemberList)?.length})</span>}
                {chatInfo.type === 'group' && groupDetails?.notice &&
                    <div className="notice" onClick={() => CreateChatGroupNotice(groupDetails?.id)}>
                        <i className={`iconfont icon-gonggao`} style={{fontSize: 14, marginRight: 5}}/>
                        <div className="ellipsis">
                            {groupDetails.notice.noticeContent}
                        </div>
                    </div>
                }
            </CustomDragDiv>
        </CustomDragDiv>
        <div ref={showFrameRef} className="chat-content-show-frame">
            {messages?.map((msg) => {
                let isRight = msg.fromId === currentUserId.current
                let member = chatGroupMemberList[msg.fromId]
                return (<div key={msg.id}>
                    {msg.isShowTime && <Time value={formatTime(msg.updateTime)}/>}
                    <div>
                        {chatInfo.type === 'group' &&
                            <div style={{display: "flex", justifyContent: isRight ? 'end' : ''}}>
                                {!isRight && <img alt=""
                                                  src={handlerGroupDisplayPortrait(member, msg)}
                                                  style={{width: 35, height: 35, borderRadius: 35}}/>}
                                <div style={{
                                    marginRight: 5,
                                    marginLeft: 5,
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: isRight ? 'end' : ''
                                }}>
                                    <div
                                        style={{display: "flex", fontSize: 12, color: "#969696", alignItems: "center"}}>
                                        <div>
                                            {handlerGroupDisplayName(member, msg)}
                                        </div>
                                        {
                                            !member &&
                                            <div className="badge-symbol">已移除</div>
                                        }
                                    </div>
                                    <div onContextMenu={(e) => handlerRightSelectMsgContent(e, msg)}>
                                        <MsgContent msg={msg} userId={currentUserId.current} onReedit={onReedit}/>
                                    </div>
                                </div>
                                {isRight && <img alt="" src={chatGroupMemberList[msg.fromId]?.portrait}
                                                 style={{width: 35, height: 35, borderRadius: 35}}/>}
                            </div>}
                        {chatInfo.type === 'user' &&
                            <div onContextMenu={(e) => handlerRightSelectMsgContent(e, msg)}>
                                <MsgContent msg={msg} userId={currentUserId.current} onReedit={onReedit}/>
                            </div>
                        }
                    </div>
                </div>)
            })}
        </div>
        <div>
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
                {chatInfo.type === 'user' && <div style={{display: "flex"}}>
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
                </div>}
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
                    <CustomButton style={{marginRight: 0}} width={40} onClick={onSendMsg}>
                        发送
                    </CustomButton>
                </CustomTooltip>
            </div>
        </div>
    </div>)
}

export default memo(CommonChatFrame)