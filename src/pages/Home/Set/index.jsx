import "./index.less"
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import {useState} from "react";
import {Redirect, Route, Switch, useHistory} from "react-router-dom";
import General from "./General/index.jsx";
import Shortcut from "./Shortcut/index.jsx";
import MessageNotify from "./MessageNotify/index.jsx";

export default function Set() {

    const [selectedSetIndex, setSelectedSetIndex] = useState(0)
    const h = useHistory();

    const sets = [
        {label: "通用", page: "/home/set/general", icon: "icon-tongyongshezhi"},
        {label: "快捷键", page: "/home/set/shortcut", icon: "icon-kuaijiejian"},
        {label: "消息通知", page: "/home/set/message-notify", icon: "icon-tongzhi"}
    ]

    return (
        <div className="set">
            <div className="set-list">
                <CustomDragDiv className="set-list-top">
                    <label className="set-list-top-title">系统设置</label>
                </CustomDragDiv>
                <div className="set-list-items">
                    {
                        sets?.map((set, index) => {
                            let isSelected = index === selectedSetIndex
                            return (
                                <div
                                    key={index} className={`set-list-item ${isSelected ? "selected" : ""}`}
                                    onClick={() => {
                                        setSelectedSetIndex(index)
                                        h.push(set.page)
                                    }}
                                >
                                    <div style={{
                                        width: 20,
                                        height: 20,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <i className={`iconfont icon ${set.icon}`} style={{fontSize: 16}}/>
                                    </div>
                                    <div style={{marginLeft: 10}}>
                                        {set.label}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <div className="set-content">
                <Switch>
                    <Route path="/home/set/general" component={General}></Route>
                    <Route path="/home/set/shortcut" component={Shortcut}></Route>
                    <Route path="/home/set/message-notify" component={MessageNotify}></Route>
                    <Redirect path="/home/set" to="/home/set/general"/>
                </Switch>
            </div>
        </div>
    )
}