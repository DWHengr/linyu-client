import "./index.less"
import {useState} from "react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import Chat from "./Chat/index.jsx";
import Friend from "./Friend/index.jsx";
import Set from "./Set/index.jsx";
import Talk from "./Talk/index.jsx";
import IconButton from "../../componets/IconButton/index.jsx";
import {appWindow} from "@tauri-apps/api/window";

export default function Home() {
    const [selectedOptionIndex, setSelectedOptionIndex] = useState(0)
    const h = useHistory();

    const onMinimize = () => {
        appWindow.minimize();
    }

    const onClose = () => {
        appWindow.close();
    }

    const onHide = () => {
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
            <div className="home">
                <div data-tauri-drag-region className="home-nav">
                    <div className="home-nav-icon">
                        <img style={{height: 60}} src="/logo.png" alt=""/>
                    </div>
                    <div className="home-nav-options">
                        {
                            options.map((option, index) => {
                                return (
                                    <div
                                        key={index}
                                        className={`home-nav-option ${index === selectedOptionIndex ? "selected" : ""}`}
                                        onClick={() => {
                                            setSelectedOptionIndex(index)
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
                </div>
                <div className="home-content">
                    <Switch>
                        <Route path="/home/chat" component={Chat}></Route>
                        <Route path="/home/friend" component={Friend}></Route>
                        <Route path="/home/set" component={Set}></Route>
                        <Route path="/home/talk" component={Talk}></Route>
                        <Redirect path="/home" to="/home/chat"/>
                    </Switch>
                </div>
                <div className="home-window-operation">
                    <IconButton
                        icon={<i className={`iconfont icon-zuixiaohua`} style={{fontSize: 22}}/>}
                        onClick={onMinimize}
                    />
                    <IconButton
                        danger
                        icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 22}}/>}
                        onClick={onHide}
                    />
                </div>
            </div>
        </div>
    )
}