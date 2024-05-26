import "./index.less"
import {useEffect, useState} from "react";
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
import {setCurrentOption} from "../../store/home/action.js";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";

export default function Home() {
    const homeStoreData = useSelector(store => store.homeData);
    const [selectedOptionIndex, setSelectedOptionIndex] = useState("chat")
    const h = useHistory();
    const dispatch = useDispatch();

    useEffect(() => {
        invoke("get_user_info", {}).then(res => {
            let token = res.token
            if (token) {
                ws.connect(token)
            }
        })
    }, [])

    useEffect(() => {
        if (homeStoreData.currentOption)
            setSelectedOptionIndex(homeStoreData.currentOption)
    }, [homeStoreData.currentOption])

    const onMinimize = () => {
        const appWindow = WebviewWindow.getByLabel('login')
        appWindow.minimize();
    }

    const onClose = () => {
        const appWindow = WebviewWindow.getByLabel('login')
        appWindow.close();
    }

    const onHide = () => {
        const appWindow = WebviewWindow.getByLabel('login')
        appWindow.hide();
    }

    const options = [
        {key: "chat", icon: "icon-liaotian", page: "/home/chat"},
        {key: "friend", icon: "icon-haoyou", page: "/home/friend"},
        {key: "talk", icon: "icon-pengyouquan", page: "/home/talk"},
        {key: "set", icon: "icon-shezhi", page: "/home/set"},
    ]

    return (
        <div className="home-container">
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
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="home-nav-my">
                        <div style={{width: 60, height: 60, borderRadius: 60, backgroundColor: "#4C9BFF"}}></div>
                    </div>
                </CustomDragDiv>
                <div className="home-content">
                    <Switch>
                        <Route path="/home/chat" component={Chat}></Route>
                        <Route path="/home/friend" component={Friend}></Route>
                        <Route path="/home/set" component={Set}></Route>
                        <Route path="/home/talk" component={Talk}></Route>
                        <Redirect path="/home" to="/home/chat"/>
                    </Switch>
                </div>
                <WindowOperation/>
            </div>
        </div>
    )
}