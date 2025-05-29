import "./index.less"
import CustomSearchInput from "../../../componets/CustomSearchInput/index.jsx";
import {useEffect, useRef, useState} from "react";
import RightClickMenu from "../../../componets/RightClickMenu/index.jsx";
import CommonChatFrame from "../../../componets/CommonChatFrame/index.jsx";
import CreateChatWindow from "../../ChatWindow/window.jsx";
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import ChatListApi from "../../../api/chatList.js";
import {useDispatch, useSelector} from "react-redux";
import {addChatWindowUser, deleteChatWindowUser, setCurrentChatId} from "../../../store/chat/action.js";
import {emit, listen} from "@tauri-apps/api/event";
import {formatTime} from "../../../utils/date.js";
import FriendApi from "../../../api/friend.js";
import {useHistory} from "react-router-dom";
import FriendSearchCard from "../../../componets/FriendSearchCard/index.jsx";
import CustomEmpty from "../../../componets/CustomEmpty/index.jsx";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import MsgContentShow from "../../../componets/MsgContentShow/index.jsx";
import {invoke} from "@tauri-apps/api/core";

export default function Chat() {
    const chatStoreData = useSelector((state) => state.chatData);
    const [selectedChatId, setSelectedChatId] = useState(chatStoreData.currentChatId)
    const currentToId = useRef(chatStoreData.currentChatId)//消息目标用户
    const [selectedUserInfo, setSelectedUserInfo] = useState(chatStoreData.currentChatUserInfo);
    const homeStoreData = useSelector(store => store.homeData);
    const currentOption = useRef(homeStoreData.currentOption)
    const selectedRightUserInfo = useRef(null);
    const rightSelected = useRef(null);
    const [menuPosition, setMenuPosition] = useState(null);
    const [topChatsData, setTopChatsData] = useState([])
    const [allChatsData, setAllChatsData] = useState([])
    const dispatch = useDispatch();
    const chatWindowUsersRef = useRef(chatStoreData.chatWindowUsers);
    const currentUserId = useRef(null)
    let h = useHistory();
    const [chatListRightOptionsFilter, setChatListRightOptionsFilter] = useState([])
    //搜索
    const [searchInfo, setSearchInfo] = useState("")
    const [searchFriendsList, setSearchFriendsList] = useState([])

    useEffect(() => {
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
        })
        onGetChatList()
    }, []);


    const chatListRightOptions = [{key: "top", label: "置顶"}, {
        key: "unTop", label: "取消置顶"
    }, // {key: "unNoDisturb", label: "设置免打扰"},
        // {key: "unNoDisturb ", label: "取消免打扰"},
        {key: "newChatWindow", label: "打开独立窗口"}, {key: "deleteChat", label: "从聊天列表中移除"},]

    const onGetChatList = () => {
        ChatListApi.list().then(res => {
            if (res.code === 0) {
                setTopChatsData(res.data.tops)
                setAllChatsData(res.data.others)
                emit("chat-list", [...res.data.tops, ...res.data.others])
            }
        })
    }

    useEffect(() => {
        // setSelectedUserInfo(chatStoreData.currentChatUserInfo)
        if (chatStoreData.currentChatUserInfo) {
            onChatListClick(chatStoreData.currentChatUserInfo)
        }
    }, [chatStoreData.currentChatUserInfo])

    useEffect(() => {
        currentOption.current = homeStoreData.currentOption
    }, [homeStoreData.currentOption])
    const onRead = (id) => {
        if (!id || id.length <= 0) return
        ChatListApi.read(id).then(() => {
            onGetChatList()
            emit("on-unread-info", {})
        })
    }

    useEffect(() => {
        let cleanupFunctions = [];
        const setup = async () => {
            try {
                // home窗口聚焦
                const window = await WebviewWindow.getByLabel('home');

                const unFocus = await window.listen("tauri://focus", (e) => {
                    onRead(currentToId.current);
                    e.stopPropagation();
                });
                cleanupFunctions.push(unFocus);

                const unRefreshChat = await window.listen("refresh-chat", (e) => {
                    onRead(e.payload.id);
                    e.stopPropagation();
                });
                cleanupFunctions.push(unRefreshChat);

                // 监听后端接受到的消息
                const unReceiveListen = await listen('on-receive-msg', async (event) => {
                    let data = event.payload;
                    const window = await WebviewWindow.getByLabel('home');
                    let isFocused = await window.isFocused();
                    let isMaximized = await window.isMaximized();
                    // 为当前发送的用户，并且home窗口聚集
                    if (currentToId.current === data.fromId && isFocused && isMaximized) {
                        onRead(data.fromId);
                    } else {
                        onGetChatList();
                    }
                    if (data.msgContent?.type === 'quit' && data.toId === selectedChatId &&
                        (data?.msgContent?.ext === currentUserId.current || data?.msgContent?.ext === 'all')) {
                        dispatch(setCurrentChatId(''))
                        setSelectedUserInfo(null)
                        setSelectedChatId(null)
                    }
                });
                cleanupFunctions.push(unReceiveListen);

                // 监听前端接受到的消息
                const unSendListen = await listen('on-send-msg', (event) => {
                    onGetChatList();
                });
                cleanupFunctions.push(unSendListen);

                // 监听聊天窗口是否销毁
                const unChatDestroyed = await listen('chat-destroyed', (event) => {
                    let storeUserInfo = chatWindowUsersRef.current.get(event.payload.fromId);
                    if (currentToId.current === storeUserInfo.fromId) {
                        setSelectedUserInfo(storeUserInfo);
                    }
                    dispatch(deleteChatWindowUser(event.payload.fromId));
                });
                cleanupFunctions.push(unChatDestroyed);

                // 监听聊天窗口是否创建
                const unChatNew = await listen('chat-new', (event) => {
                    if (currentToId.current === rightSelected.current) {
                        setSelectedUserInfo(null);
                    }
                });
                cleanupFunctions.push(unChatNew);

                // 监听聊天列表删除是否创建
                const unChatListDelete = await listen('chat-list-delete', (event) => {
                    dispatch(setCurrentChatId(''))
                    setSelectedUserInfo(null)
                    setSelectedChatId(null)
                    onGetChatList()
                });
                cleanupFunctions.push(unChatListDelete);

            } catch (error) {
                console.error("Error in useEffect setup:", error);
            }
        };

        setup();

        // 清理函数
        return () => {
            cleanupFunctions.forEach(cleanup => {
                if (typeof cleanup === 'function') {
                    cleanup();
                } else if (cleanup && typeof cleanup.then === 'function') {
                    cleanup.then(fn => fn && fn());
                }
            });
        };
    }, []);

    useEffect(() => {
        chatWindowUsersRef.current = chatStoreData.chatWindowUsers
    }, [chatStoreData.chatWindowUsers])

    useEffect(() => {
        onRead(chatStoreData.currentChatId)
        setSelectedChatId(chatStoreData.currentChatId)
    }, [chatStoreData.currentChatId])

    useEffect(() => {
        currentToId.current = selectedChatId
    }, [selectedChatId])

    const onMenuItemClick = (item) => {
        switch (item.key) {
            case "top": {
                ChatListApi.top({chatListId: selectedRightUserInfo.current.id, isTop: true}).then(res => {
                    if (res.code === 0) {
                        onGetChatList()
                    }
                })
                break
            }
            case "unTop": {
                ChatListApi.top({chatListId: selectedRightUserInfo.current.id, isTop: false}).then(res => {
                    if (res.code === 0) {
                        onGetChatList()
                    }
                })
                break
            }
            case "newChatWindow" : {
                emit("chat-new", selectedRightUserInfo.current)
                break
            }
            case "deleteChat": {
                ChatListApi.delete({chatListId: selectedRightUserInfo.current.id}).then(res => {
                    if (res.code === 0) {
                        if (selectedChatId === selectedRightUserInfo.current.fromId) {
                            setSelectedUserInfo(null)
                            setSelectedChatId(null)
                        }
                        dispatch(setCurrentChatId(''))
                        onGetChatList()
                    }
                })
                break
            }
        }
    }

    useEffect(() => {
        if (searchInfo) {
            FriendApi.search({searchInfo: searchInfo}).then(res => {
                if (res.code === 0) {
                    setSearchFriendsList(res.data)
                }
            })
        }
    }, [searchInfo])

    const onChatListClick = (data) => {
        setSelectedChatId(data.fromId)
        let storeUserInfo = chatStoreData.chatWindowUsers.get(data.fromId);
        if (storeUserInfo) {
            setSelectedUserInfo(null)
            CreateChatWindow(storeUserInfo.fromId, "linyu", storeUserInfo.type)
            return
        }
        if (selectedChatId === data.fromId) return
        setSelectedUserInfo(data)
        dispatch(setCurrentChatId(data.fromId, data))
    }

    const ChatCard = ({info, onClick, onContextMenu}) => {
        let isSelected = false
        if (info.fromId === selectedChatId) {
            isSelected = true
        }
        return (<div
            className={`chat-card ${isSelected ? "selected" : ""}`}
            onMouseDown={(e) => {
                onClick(info)
            }}
            onContextMenu={(e) => {
                e.preventDefault()
                if (onContextMenu) onContextMenu(e)
            }}
        >
            <img className="chat-card-portrait" src={info.portrait}
                 alt={info.portrait}/>
            <div className="chat-card-content">
                <div className="chat-card-content-item">
                    <div style={{display: "flex", alignItems: "center"}}>
                        <div
                            style={{
                                fontSize: 14, fontWeight: 600, color: `${isSelected ? "#FFF" : "1F1F1F"}`
                            }}
                            className="ellipsis"
                        >
                            {info.remark ? info.remark : info.name}
                        </div>
                        {info.type === 'group' && <div className="qun">群</div>}
                    </div>
                    <div style={{
                        fontSize: 10, color: `${isSelected ? "#F6F6F6" : "#646464"}`
                    }}>{formatTime(info.updateTime)}</div>
                </div>
                <div className="chat-card-content-item">
                    <div
                        style={{fontSize: 12, color: `${isSelected ? "#F6F6F6" : "#646464"}`}}
                        className="ellipsis"
                    >
                        <MsgContentShow msgContent={info.lastMsgContent}/>
                    </div>
                    {info.unreadNum > 0 && !isSelected ? <div className="unread">
                        {info.unreadNum < 99 ? info.unreadNum : "99+"}
                    </div> : <></>}
                </div>
            </div>
        </div>)
    }

    const onSendMsgClick = (friendId) => {
        setSearchInfo("")
        ChatListApi.create({toId: friendId}).then(res => {
            if (res.code === 0) {
                dispatch(setCurrentChatId(friendId, res.data))
                setSelectedUserInfo(res.data)
            }
        })
    }

    const onChatListRightMenu = (e, data) => {
        setChatListRightOptionsFilter([data.isTop ? "top" : "unTop"])
        rightSelected.current = data.fromId;
        selectedRightUserInfo.current = data;
        setMenuPosition({x: e.clientX, y: e.clientY})
    }

    return (<div className="chat">
        <div className="chat-list">
            <CustomDragDiv className="chat-list-top">
                <label className="chat-list-top-title">聊天列表</label>
                <div>
                    <CustomSearchInput
                        value={searchInfo}
                        onChange={(v) => setSearchInfo(v)}
                    />
                </div>
            </CustomDragDiv>
            <RightClickMenu
                position={menuPosition}
                options={chatListRightOptions}
                filter={chatListRightOptionsFilter}
                onMenuItemClick={onMenuItemClick}
            />
            {!searchInfo ? <div
                className="chat-list-items">
                {topChatsData?.length > 0 && <div className="chat-list-items-label">置顶</div>}
                {topChatsData.map(data => {
                    return (<ChatCard
                        key={data.id}
                        onContextMenu={(e) => onChatListRightMenu(e, data)}
                        info={data}
                        onClick={() => onChatListClick(data)}
                    />)
                })}
                {allChatsData?.length > 0 && <div className="chat-list-items-label">全部</div>}
                {allChatsData.map(data => {
                    return (<ChatCard
                        key={data.id}
                        onContextMenu={(e) => onChatListRightMenu(e, data)}
                        info={data}
                        onClick={() => onChatListClick(data)}
                    />)
                })}
                {(allChatsData?.length <= 0 && topChatsData.length <= 0) &&
                    <CustomEmpty placeholder="暂时没有新消息~"/>}
            </div> : <div className="chat-list-items">
                {searchFriendsList.length > 0 ? <div>
                    {searchFriendsList.map((friend) => {
                        return (<FriendSearchCard
                            info={friend}
                            onClick={() => onSendMsgClick(friend.friendId)}
                        />)
                    })}
                </div> : <CustomEmpty/>}
            </div>}
        </div>
        {selectedUserInfo ? <CommonChatFrame chatInfo={selectedUserInfo}/> :
            <CustomDragDiv style={{display: "flex", flex: 1, alignItems: "center", justifyContent: "center"}}>
                <img style={{height: 120}} src="/bg.png" alt=""/>
            </CustomDragDiv>}
    </div>)
}