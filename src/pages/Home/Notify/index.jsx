import "./index.less"
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import FriendNotify from "./FriendNotify/index.jsx";
import {emit} from "@tauri-apps/api/event";
import NotifyApi from "../../../api/notify.js";

export default function Notify() {

    const [selectedNotifyIndex, setSelectedNotifyIndex] = useState("friend")
    const selectedNotifyIndexRef = useRef(selectedNotifyIndex);

    const notifyOptions = [
        {key: "friend", label: "好友通知", page: "", icon: "icon-haoyou"},
        {key: "system", label: "系统通知", page: "", icon: "icon-xitong"}
    ]

    let onReadNotify = (type) => {
        NotifyApi.read({notifyType: type}).then(res => {
            if (res.code === 0) {
                emit("on-unread-info", {})
            }
        })
    }

    useEffect(() => {
        onReadNotify(selectedNotifyIndex)
    }, [selectedNotifyIndex])

    return (
        <div className="notify">
            <div className="notify-list">
                <CustomDragDiv className="notify-list-top">
                    <label className="notify-list-top-title">通知</label>
                </CustomDragDiv>
                <div className="notify-list-items">
                    {
                        notifyOptions?.map((notify) => {
                            let isSelected = notify.key === selectedNotifyIndex
                            return (
                                <div
                                    key={notify.key} className={`notify-list-item ${isSelected ? "selected" : ""}`}
                                    onClick={() => {
                                        selectedNotifyIndexRef.current = notify.key
                                        setSelectedNotifyIndex(notify.key)
                                    }}
                                >
                                    <div style={{
                                        width: 20,
                                        height: 20,
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center"
                                    }}>
                                        <i className={`iconfont icon ${notify.icon}`} style={{fontSize: 16}}/>
                                    </div>
                                    <div style={{marginLeft: 10}}>
                                        {notify.label}
                                    </div>
                                </div>
                            )
                        })
                    }
                </div>
            </div>
            <CustomDragDiv className="notify-content">
                <Switch>
                    <Route path="/home/notify/friend" component={FriendNotify}></Route>
                    <Redirect path="/home/notify" to="/home/notify/friend"/>
                </Switch>
            </CustomDragDiv>
        </div>
    )
}