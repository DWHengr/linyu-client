import "./index.less"
import {useEffect, useRef, useState} from "react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import Chat from "./Chat/index.jsx";
import Friend from "./Friend/index.jsx";
import Set from "./Set/index.jsx";
import Talk from "./Talk/index.jsx";
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import ws from "../../utils/ws.js";
import {invoke} from "@tauri-apps/api/core";
import {useDispatch, useSelector} from "react-redux";
import {setCurrentLoginUserInfo, setCurrentOption} from "../../store/home/action.js";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import CreateTrayWindow from "../TrayMenu/window.jsx";
import Notify from "./Notify/index.jsx";
import UserApi from "../../api/user.js";
import {emit, listen} from "@tauri-apps/api/event";
import CrateMessageBox from "../MessageBox/window.jsx";
import {setCurrentChatId} from "../../store/chat/action.js";
import ChatListApi from "../../api/chatList.js";

export default function Home() {
    const homeStoreData = useSelector(store => store.homeData);
    const chatStoreData = useSelector((state) => state.chatData);
    const currentOption = useRef(homeStoreData.currentOption)
    const currentToId = useRef(chatStoreData.currentChatId)//消息目标用户
    const [selectedOptionIndex, setSelectedOptionIndex] = useState("chat")
    const h = useHistory();
    const dispatch = useDispatch();
    const [unreadInfo, setUnreadInfo] = useState({})

    useEffect(() => {
        const appWindow = WebviewWindow.getByLabel('home')
        appWindow.listen("tauri://close-requested", function (e) {
            appWindow.hide()
        });
        invoke("get_user_info", {}).then(res => {
            dispatch(setCurrentLoginUserInfo(res.user_id, res.username, res.account, res.portrait))
            let token = res.token
            if (token) {
                ws.connect(token)
                CreateTrayWindow()
                CrateMessageBox()
                onGetUserUnreadNum()
            }
        })
    }, [])

    const onGetChatList = () => {
        ChatListApi.list().then(res => {
            if (res.code === 0) {
                emit("chat-list", [...res.data.tops, ...res.data.others])
            }
        })
    }

    useEffect(() => {
        //监听后端接受到的消息
        const unMsgListen = listen('on-receive-msg', (event) => {
            onGetChatList()
            if (currentOption.current !== "chat") {
                onGetUserUnreadNum()
                return
            }
            let data = event.payload
            if (currentToId.current !== data.fromId) {
                onGetUserUnreadNum()
            }
        });
        const unUnreadListen = listen('on-unread-info', (event) => {
            onGetUserUnreadNum()
        });
        const unNotifyListen = listen('on-receive-notify', (event) => {
            if (currentOption.current !== "notify") {
                onGetChatList()
                onGetUserUnreadNum()
            }
        });
        let unChatListJumpListen = listen('chat-list-jump', async (event) => {
            let info = event.payload
            const window = WebviewWindow.getByLabel('home')
            window.show()
            window.unminimize()
            window.setFocus()
            dispatch(setCurrentChatId(info.fromId, info))
            dispatch(setCurrentOption("chat"))
            h.push("/home/chat")
        })
        return async () => {
            (await unMsgListen)();
            (await unUnreadListen)();
            (await unNotifyListen)();
            (await unChatListJumpListen)();
        }
    }, [])

    let onGetUserUnreadNum = () => {
        UserApi.unread().then(res => {
            if (res.code === 0) {
                setUnreadInfo(res.data)
            }
        })
    }

    useEffect(() => {
        currentOption.current = homeStoreData.currentOption
        if (homeStoreData.currentOption)
            setSelectedOptionIndex(homeStoreData.currentOption)
    }, [homeStoreData.currentOption])


    useEffect(() => {
        currentToId.current = chatStoreData.currentChatId
    }, [chatStoreData.currentChatId])

    useEffect(() => {
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

    const options = [
        {key: "chat", icon: "icon-liaotian", page: "/home/chat"},
        {key: "friend", icon: "icon-haoyou", page: "/home/friend"},
        {key: "talk", icon: "icon-pengyouquan", page: "/home/talk"},
        {key: "notify", icon: "icon-tongzhi", page: "/home/notify"},
        {key: "set", icon: "icon-shezhi", page: "/home/set"},
    ]

    return (
        <div
            tabIndex="0"
            className="home-container"
            // onFocus={(e) => {
            //     emit("home-focus", {})
            //     e.stopPropagation()
            // }}
        >
            <div className="overlay"></div>
            <div className="home">
                <CustomDragDiv className="home-nav">
                    <div className="home-nav-icon">
                        <img style={{height: 60}} src="/logo.png" alt=""/>
                    </div>
                    <div className="home-nav-options">
                        {
                            options.map((option) => {
                                return (
                                    <div
                                        key={option.key}
                                        className={`home-nav-option ${option.key === selectedOptionIndex ? "selected" : ""}`}
                                        onClick={() => {
                                            setSelectedOptionIndex(option.key)
                                            dispatch(setCurrentOption(option.key))
                                            h.push(option.page)
                                        }}
                                    >
                                        <i className={`iconfont ${option.icon}`} style={{fontSize: 30}}/>
                                        {
                                            unreadInfo[option.key] && unreadInfo[option.key] > 0 ?
                                                <div className="home-nav-option-tip">
                                                    {unreadInfo[option.key]}
                                                </div>
                                                : <></>
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="home-nav-my">
                        <div>
                            <img style={{width: 60, height: 60, borderRadius: 60,}} src={homeStoreData.portrait}
                                 alt={homeStoreData.portrait}/>
                        </div>
                    </div>
                </CustomDragDiv>
                <div className="home-content">
                    <Switch>
                        <Route path="/home/chat" component={Chat}></Route>
                        <Route path="/home/friend" component={Friend}></Route>
                        <Route path="/home/set" component={Set}></Route>
                        <Route path="/home/notify" component={Notify}></Route>
                        <Route path="/home/talk" component={Talk}></Route>
                        <Redirect path="/home" to="/home/chat"/>
                    </Switch>
                </div>
                <WindowOperation/>
            </div>
        </div>
    )
}