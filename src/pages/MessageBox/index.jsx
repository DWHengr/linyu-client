import "./index.less"
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import {memo, useEffect, useRef, useState} from "react";
import {invoke} from "@tauri-apps/api/core";
import {emit, listen} from "@tauri-apps/api/event";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import {LogicalSize} from "@tauri-apps/api/dpi";
import {messageBoxWindowHeight, messageBoxWindowWidth} from "./window.jsx";
import {useDispatch} from "react-redux";
import {useHistory} from "react-router-dom";
import {TrayIcon} from '@tauri-apps/api/tray';
import {PhysicalPosition} from "@tauri-apps/api/window";

function MessageBox() {
    const [chats, setChats] = useState([])
    const [userInfo, setUserInfo] = useState({});
    const dispatch = useDispatch();
    const h = useHistory();
    let intervalId = useRef(null)
    let timeoutId = useRef(null)
    let imgRef = useRef(null)
    const chatsLengthRef = useRef(0)

    useEffect(() => {
        let trayEnterListen = listen('tray_enter', async (event) => {
            if (chatsLengthRef.current <= 0) return
            const homeWindow = WebviewWindow.getByLabel('massage-box')
            if (!homeWindow) return

            let position = event.payload;
            let scaleFactor = await homeWindow.scaleFactor();
            let logicalPosition = new PhysicalPosition(position.x, 100).toLogical(scaleFactor);
            logicalPosition.x = logicalPosition.x - messageBoxWindowWidth / 2
            logicalPosition.y = window.screen.availHeight - messageBoxWindowHeight - chatsLengthRef.current * 70

            let trayWindow = WebviewWindow.getByLabel('massage-box')
            if (trayWindow) {
                await trayWindow.setAlwaysOnTop(true)
                await trayWindow.setPosition(logicalPosition)
                await trayWindow.show()
                await trayWindow.setFocus()
            }
        })

        let trayLeaveListen = listen('tray_leave', async (event) => {
            // clearTimeout(timeoutId.current)
            // timeoutId.current = setTimeout(function () {
            //     const homeWindow = WebviewWindow.getByLabel('massage-box')
            //     if (homeWindow) {
            //         homeWindow.hide()
            //     }
            // }, 400);
        })
        return async () => {
            (await trayEnterListen)();
            (await trayLeaveListen)();
        }
    }, [])

    useEffect(() => {
        (async () => {
            let userInfo = await invoke("get_user_info", {})
            setUserInfo(userInfo)
        })()
        //监听聊天列表的变化
        const unChatListen = listen('chat-list', (event) => {
            let chats = event.payload;
            let unreadChats = []
            for (let i = 0; i < chats.length; i++) {
                if (chats[i].unreadNum > 0) {
                    unreadChats.push(chats[i])
                }
            }
            setChats(unreadChats)
        });
        return async () => {
            (await unChatListen)();
            onClearIntervalId()
        }
    }, [])

    const setTrayDefaultIcon = async () => {
        let img = await invoke("default_window_icon")
        let tray = await TrayIcon.getById("tray")
        tray.setIcon(img)
    }

    const onClearIntervalId = () => {
        chatsLengthRef.current = 0
        setTrayDefaultIcon()
        clearInterval(intervalId.current);
        clearTimeout(timeoutId.current)
    }

    useEffect(() => {
        const boxWindow = WebviewWindow.getByLabel('massage-box')
        if (chats.length <= 0) {
            onClearIntervalId()
        } else {
            boxWindow.setSize(new LogicalSize(messageBoxWindowWidth, messageBoxWindowHeight + chats.length * 70));
            (async () => {
                if (!imgRef.current) {
                    imgRef.current = await invoke("default_window_icon")
                }
                TrayIcon.getById("tray").then(res => {
                    let flag = true
                    onClearIntervalId()
                    chatsLengthRef.current = chats.length
                    timeoutId.current = setTimeout(() => {
                        invoke("audio", {})
                    }, 500)
                    intervalId.current = setInterval(function () {
                        if (flag) {
                            res.setIcon(null)
                        } else {
                            res.setIcon(imgRef.current)
                        }
                        flag = !flag
                    }, 400);
                })
            })();
        }
    }, [chats])

    const onChatJump = (info) => {
        emit("chat-list-jump", info)
    }

    return (
        <div className="message-box-container">
            <CustomDragDiv className="message-box">
                <div className="message-box-top">{userInfo.username}</div>
                <div className="message-box-content">
                    {
                        chats?.map(info => {
                            return (
                                <div
                                    key={info.id}
                                    className="message-box-content-item"
                                    onClick={() => onChatJump(info)}
                                >
                                    <img className="chat-card-portrait" src={info.portrait}
                                         alt={info.portrait}/>
                                    <div className="chat-card-content">
                                        <div className="chat-card-content-item">
                                            <div
                                                style={{
                                                    fontSize: 14,
                                                    fontWeight: 600,
                                                }}
                                                className="ellipsis"
                                            >
                                                {info.remark ? info.remark : info.name}
                                            </div>
                                        </div>
                                        <div className="chat-card-content-item">
                                            <div
                                                style={{fontSize: 12}}
                                                className="ellipsis"
                                            >
                                                {info.lastMsgContent?.content}
                                            </div>
                                            <div style={{
                                                width: 18,
                                                minWidth: 18,
                                                height: 18,
                                                borderRadius: 16,
                                                backgroundColor: "#4C9BFF",
                                                fontSize: 12,
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                color: "#fff"
                                            }}>
                                                {info.unreadNum < 99 ? info.unreadNum : "99+"}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
                <div className="message-box-bottom">忽略全部</div>
            </CustomDragDiv>
        </div>
    )
}

export default memo(MessageBox)