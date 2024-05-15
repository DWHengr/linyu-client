import "./index.less"
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import {useState} from "react";
import {Redirect, Route, Switch} from "react-router-dom";
import General from "./General/index.jsx";

export default function Set() {

    const [selectedSetIndex, setSelectedSetIndex] = useState(0)

    const sets = [
        {label: "通用", page: "", icon: "icon-tongyongshezhi"},
        {label: "快捷键", page: "", icon: "icon-kuaijiejian"},
        {label: "消息通知", page: "", icon: "icon-tongzhi"}
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
                                    onClick={() => setSelectedSetIndex(index)}
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
                    <Redirect path="/home/set" to="/home/set/general"/>
                </Switch>
            </div>
        </div>
    )
}