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
import {addChatWindowUser, deleteChatWindowUser, setCurrentChatId} from "../../store/chat/action.js";
import ChatListApi from "../../api/chatList.js";
import CreateVideoChat from "../VideoChat/window.jsx";
import CustomModal from "../../componets/CustomModal/index.jsx";
import IconButton from "../../componets/IconButton/index.jsx";
import CustomInput from "../../componets/CustomInput/index.jsx";
import CustomButton from "../../componets/CustomButton/index.jsx";
import {formatDateString} from "../../utils/date.js";
import Dropzone from "react-dropzone";
import {useToast} from "../../componets/CustomToast/index.jsx";
import RightClickContent from "../../componets/RightClickContent/index.jsx";
import CustomLine from "../../componets/CustomLine/index.jsx";
import UserSetApi from "../../api/userSet.js";
import {shortcutRegisterAndEmit} from "../../utils/shortcut.js";
import {setItem} from "../../utils/storage.js";
import CreateScreenshot from "../screenshot/window.jsx";
import CreateAboutWindow from "../AboutWindow/window.jsx";
import CreateImageViewer from "../ImageViewer/window.jsx";
import {getFileNameAndType} from "../../utils/string.js";
import CreateCmdWindow from "../Command/window.jsx";
import CreateChatWindow from "../ChatWindow/window.jsx";

export default function Home() {
    const homeStoreData = useSelector(store => store.homeData)
    const chatStoreData = useSelector((state) => state.chatData)
    const currentOption = useRef(homeStoreData.currentOption)
    const currentToId = useRef(chatStoreData.currentChatId)//消息目标用户
    const [selectedOptionIndex, setSelectedOptionIndex] = useState("chat")
    const h = useHistory();
    const dispatch = useDispatch();
    const [unreadInfo, setUnreadInfo] = useState({})
    const [userInfo, setUserInfo] = useState({name: "", signature: "", sex: ""})
    const [isOpenEditInfo, setIsOpenEditInfo] = useState(false)
    const userInfoBackCache = useRef(null)
    let showToast = useToast()
    const [userInfoPosition, setUserInfoPosition] = useState(null)
    const [userInfoVisible, setUserInfoVisible] = useState(false)

    useEffect(() => {
        const appWindow = WebviewWindow.getByLabel('home')
        appWindow.listen("tauri://close-requested", function (e) {
            appWindow.hide()
        });
        let unHideOrShowHome = listen("hideOrShowHome", async function (e) {
            let isVisible = await appWindow.isVisible();
            if (isVisible) {
                await appWindow.hide()
            } else {
                await appWindow.setFocus()
                await appWindow.unminimize()
                await appWindow.show()
            }
        });
        //监听截图快捷键事件
        const unScreenshot = listen('screenshot', async (event) => {
            if (currentOption.current !== 'chat' || !currentToId.current) {
                CreateScreenshot("");
            }
        })
        //监听命令行模式
        const unCmd = listen('command', async (event) => {
            CreateCmdWindow();
        })
        invoke("get_user_info", {}).then(res => {
            dispatch(setCurrentLoginUserInfo(res.user_id, res.username, res.account, res.portrait))
            let token = res.token
            userInfoBackCache.current = res
            if (token) {
                ws.connect(token)
                CreateTrayWindow()
                CrateMessageBox()
                CreateCmdWindow()
                onGetUserUnreadNum()
                onGetUserSet()
            }
        })
        return async () => {
            (await unHideOrShowHome)();
            (await unScreenshot)();
            (await unCmd)();
        }
    }, [])

    const onGetChatList = () => {
        ChatListApi.list().then(res => {
            if (res.code === 0) {
                emit("chat-list", [...res.data.tops, ...res.data.others])
            }
        })
    }

    const registerAllShortcut = async (value) => {
        //cmd
        shortcutRegisterAndEmit("alt+space", "command")
        //screenshot
        shortcutRegisterAndEmit(value.screenshot, "screenshot")
        //hideOrShowHome
        shortcutRegisterAndEmit(value.hideOrShowHome, "hideOrShowHome")
        //openUnreadMsg
        shortcutRegisterAndEmit(value.openUnreadMsg, "openUnreadMsg")
        //closeMsgWindow
        shortcutRegisterAndEmit(value.closeMsgWindow, "closeMsgWindow")
    }

    const onGetUserSet = () => {
        UserSetApi.getUserSet().then(res => {
            if (res.code === 0) {
                registerAllShortcut(res.data.sets)
                setItem("user-sets", res.data.sets)
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
        const unChatDestroyed = listen('chat-destroyed', (event) => {
            dispatch(deleteChatWindowUser(event.payload.fromId))
        })
        const unChatNew = listen('chat-new', (event) => {
            let data = event.payload
            dispatch(addChatWindowUser(data))
            let title = data.remark ? data.remark : data.name
            CreateChatWindow(data.fromId, title ? title : "linyu")
        })
        const unUnreadListen = listen('on-unread-info', (event) => {
            onGetUserUnreadNum()
        });
        const unNotifyListen = listen('on-receive-notify', (event) => {
            if (currentOption.current !== "notify") {
                onGetChatList()
                onGetUserUnreadNum()
            }
        });
        const unVideoListen = listen('on-receive-video', async (event) => {
            let data = event.payload
            if (data.type === "invite") {
                CreateVideoChat(data.fromId, false, data.isOnlyAudio)
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
            (await unVideoListen)();
            (await unChatListJumpListen)();
            (await unChatDestroyed)();
            (await unChatNew)();
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
        {key: "chat", icon: "chat", page: "/home/chat"},
        {key: "friend", icon: "user", page: "/home/friend"},
        {key: "talk", icon: "talk", page: "/home/talk"},
        {key: "notify", icon: "notify", page: "/home/notify"},
        {key: "set", icon: "set", page: "/home/set"},
    ]

    const onGetUserInfo = (e) => {
        UserApi.info().then(res => {
            if (res.code === 0) {
                setUserInfo(res.data)
                setUserInfoPosition({x: e.clientX, y: e.clientY})
            }
        })
    }

    const updateUserInfoCache = (info) => {
        userInfoBackCache.current = info
        invoke('save_user_info', info)
        dispatch(setCurrentLoginUserInfo(info.userid, info.username, userInfo.account, info.portrait))
        emit("user-info-reload", info)
    }

    const onAvatarChange = (file) => {
        UserApi.upload(file).then(res => {
            if (res.code === 0) {
                setUserInfo({...userInfo, portrait: res.data})
                showToast("头像修改成功~")
                let info = {
                    userid: userInfoBackCache.current.user_id,
                    username: userInfo.name,
                    token: userInfoBackCache.current.token,
                    portrait: res.data,
                }
                updateUserInfoCache(info)
            }
        })
    }

    const onEditInfo = async () => {
        UserApi.update(userInfo).then(res => {
            showToast("信息修改成功~")
            let info = {
                userid: userInfoBackCache.current.user_id,
                username: userInfo.name,
                token: userInfoBackCache.current.token,
                portrait: userInfo.portrait,
            }
            updateUserInfoCache(info)
        })
        setIsOpenEditInfo(false)
    }

    return (
        <div
            className="home-container"
        >
            <div className="overlay"></div>
            <div className="home">
                <RightClickContent position={userInfoPosition} visible={userInfoVisible}>
                    <div className="user-info">
                        <div style={{display: "flex", height: 60, alignItems: "center", marginBottom: 10}}>
                            <img className="user-info-portrait"
                                 alt=""
                                 src={userInfo.portrait}
                                 onClick={() => {
                                     CreateImageViewer(getFileNameAndType(userInfo.portrait).fileName, userInfo.portrait)
                                 }}
                            />
                            <div style={{flex: 1, overflow: "hidden"}}>
                                <div className="ellipsis">{userInfo.name}</div>
                                <div className="ellipsis"
                                     style={{fontSize: 14, color: "#989898"}}>{userInfo.account}</div>
                            </div>
                        </div>
                        <CustomLine width={1}/>
                        <div style={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "space-between",
                            alignItems: "center",
                        }}>
                            <CustomButton
                                width={160}
                                style={{marginTop: 10}} o
                                onClick={() => {
                                    setUserInfoVisible({value: false})
                                    setIsOpenEditInfo(true)
                                }}
                            >
                                编辑信息
                            </CustomButton>
                            <CustomButton
                                width={160}
                                type="line"
                                style={{marginTop: 5}}
                                onClick={() => {
                                    setUserInfoVisible({value: false})
                                    h.replace('/home/talk/reload');
                                    setTimeout(() => {
                                        h.replace("/home/talk/all", {targetId: userInfo.id})
                                    });
                                    dispatch(setCurrentOption("talk"))
                                }}
                            >
                                我的说说
                            </CustomButton>
                        </div>
                    </div>
                </RightClickContent>
                <CustomDragDiv className="home-nav">
                    <div>
                        <CustomModal
                            isOpen={isOpenEditInfo}
                        >
                            <div className="edit-info">
                                <div className="edit-info-top">
                                    <div style={{fontSize: 12}}>
                                        编辑信息
                                    </div>
                                    <div style={{position: "absolute", right: 10}}>
                                        <IconButton
                                            danger
                                            icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 20}}/>}
                                            onClick={() => setIsOpenEditInfo(false)}
                                        />
                                    </div>
                                </div>
                                <div style={{
                                    width: "90%",
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "center",
                                    alignItems: "center"
                                }}>
                                    <Dropzone
                                        onDrop={(acceptedFiles) => onAvatarChange(acceptedFiles[0])}
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
                                                    <img style={{width: 80, height: 80, borderRadius: 80}}
                                                         src={userInfo.portrait}
                                                         alt={userInfo.portrait}/>
                                                    <div className="portrait-info-cover">
                                                        <i className={`iconfont icon-xiangji`}
                                                           style={{color: "#fff", fontSize: 40}}/>
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </Dropzone>
                                    <div style={{
                                        display: "flex",
                                        marginBottom: 20,
                                        width: 160,
                                        justifyContent: "space-between"
                                    }}>
                                        <div
                                            className={`sex-info  ${userInfo.sex === "男" ? "nan" : ""}`}
                                            onClick={() => setUserInfo({...userInfo, sex: "男"})}
                                        >
                                            <i className={`iconfont icon-nan`}
                                               style={{marginRight: 5}}/>
                                            <div>男生</div>
                                        </div>
                                        <div
                                            className={`sex-info  ${userInfo.sex === "女" ? "nv" : ""}`}
                                            onClick={() => setUserInfo({...userInfo, sex: "女"})}
                                        >
                                            <i className={`iconfont icon-nv`}
                                               style={{marginRight: 5}}/>
                                            <div>女生</div>
                                        </div>
                                    </div>
                                    <div style={{width: "100%"}}>
                                        <div style={{marginBottom: 20}}>
                                            <CustomInput
                                                pre="昵称"
                                                value={userInfo.name}
                                                limit={30}
                                                onChange={(v) => setUserInfo({...userInfo, "name": v})}
                                            />
                                        </div>
                                        <div style={{marginBottom: 20}}>
                                            <CustomInput
                                                pre="签名"
                                                limit={100}
                                                value={userInfo.signature}
                                                onChange={(v) => setUserInfo({...userInfo, "signature": v})}
                                            />
                                        </div>
                                        <div style={{marginBottom: 20}}>
                                            <CustomInput
                                                value={formatDateString(userInfo.birthday)}
                                                pre="生日"
                                                type="date"
                                                onChange={(v) => setUserInfo({...userInfo, "birthday": v})}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div style={{display: "flex", position: "absolute", right: 10, bottom: 10}}>
                                    <CustomButton
                                        width={55}
                                        onClick={onEditInfo}
                                    >
                                        保存
                                    </CustomButton>
                                    <CustomButton
                                        width={55}
                                        type="minor"
                                        onClick={() => setIsOpenEditInfo(false)}
                                    >
                                        取消
                                    </CustomButton>
                                </div>
                            </div>
                        </CustomModal
                        >
                    </div>
                    <div className="home-nav-icon" onClick={CreateAboutWindow}>
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
                                        {/*<i className={`iconfont ${option.icon}`} style={{fontSize: 30}}/>*/}
                                        <img alt=""
                                             src={`/icon/${option.icon + (option.key === selectedOptionIndex ? "" : "-empty")}.png`}
                                             style={{width: 34, height: 34}}/>
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
                    <div
                        className="home-nav-my"
                        onClick={onGetUserInfo}
                    >
                        <img style={{width: 55, height: 55, borderRadius: 55,}} src={homeStoreData.portrait}
                             alt={homeStoreData.portrait}/>
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