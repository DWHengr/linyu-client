import "./index.less"
import CustomSearchInput from "../../../componets/CustomSearchInput/index.jsx";
import {useState} from "react";
import Time from "./ChatContent/Time/index.jsx";
import Msg from "./ChatContent/Msg/index.jsx";
import CustomButton from "../../../componets/CustomButton/index.jsx";

export default function Chat() {

    const [selectedChatId, setSelectedChatId] = useState("1")

    const topChatsData = [
        {
            id: "1",
            remark: "小红",
            lastMsg: "你在干什么?",
            lastMsgTime: "14:20",
        }
    ]

    const allChatsData = [
        {
            id: "2",
            remark: "小绿",
            lastMsg: "你在干什么?",
            lastMsgTime: "14:20",
        },
        {
            id: "3",
            remark: "小蓝",
            lastMsg: "你在干什么?",
            lastMsgTime: "14:20",
            unreadNum: 10
        }
    ]

    const ChatCard = ({info, onClick}) => {
        let isSelected = info.id === selectedChatId
        return (
            <div
                className={`chat-card ${isSelected ? "selected" : ""}`}
                onClick={() => onClick(info)}
            >
                <div className="chat-card-portrait"></div>
                <div className="chat-card-content">
                    <div className="chat-card-content-item">
                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: `${isSelected ? "#FFF" : "1F1F1F"}`
                            }}
                        >
                            {info.remark ? info.remark : info.name}</div>
                        <div style={{
                            fontSize: 10,
                            color: `${isSelected ? "#F6F6F6" : "#646464"}`
                        }}>{info.lastMsgTime}</div>
                    </div>
                    <div className="chat-card-content-item">
                        <div style={{fontSize: 12, color: `${isSelected ? "#F6F6F6" : "#646464"}`}}>{info.lastMsg}</div>
                        {
                            info.unreadNum > 0 ? <div style={{
                                    width: 18,
                                    height: 18,
                                    borderRadius: 16,
                                    backgroundColor: "#4C9BFF",
                                    fontSize: 12,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    color: "#fff"
                                }}>
                                    {info.unreadNum}
                                </div> :
                                <></>
                        }
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="chat">
            <div className="chat-list">
                <div data-tauri-drag-region className="chat-list-top">
                    <label className="chat-list-top-title">聊天列表</label>
                    <div>
                        <CustomSearchInput></CustomSearchInput>
                    </div>
                </div>
                <div className="chat-list-items">
                    <div className="chat-list-items-label">置顶</div>
                    {
                        topChatsData.map(data => {
                            return <ChatCard info={data} onClick={() => setSelectedChatId(data.id)}/>
                        })
                    }
                    <div className="chat-list-items-label">全部</div>
                    {
                        allChatsData.map(data => {
                            return <ChatCard info={data} onClick={() => setSelectedChatId(data.id)}/>
                        })
                    }
                </div>
            </div>
            <div className="chat-content">
                <div data-tauri-drag-region className="chat-content-title">
                    <div>
                        <div style={{
                            width: 40,
                            height: 40,
                            backgroundColor: "#4C9BFF",
                            borderRadius: 50,
                            marginLeft: 10
                        }}>
                        </div>
                    </div>
                    <div style={{
                        fontWeight: 600,
                        color: "#1F1F1F",
                        marginLeft: 10,
                    }}>
                        小红
                    </div>
                </div>
                <div className="chat-content-show-frame">
                    <Time value="昨天 20:20"/>
                    <Msg value="睡觉了"/>
                    <Msg value="今天就先不说了"/>
                    <Msg value="好的" right/>
                </div>
                <div className="chat-content-send-frame">
                    <div className="chat-content-send-frame-operation">
                        <div style={{display: "flex"}}>
                            <i className={`iconfont icon icon-biaoqing`} style={{fontSize: 24}}/>
                            <i className={`iconfont icon icon-wenjian`} style={{fontSize: 26}}/>
                            <i className={`iconfont icon icon-jilu`} style={{fontSize: 22}}/>
                        </div>
                        <div style={{display: "flex"}}>
                            <i className={`iconfont icon icon-dianhua`} style={{fontSize: 24}}/>
                            <i className={`iconfont icon icon-shipin`} style={{fontSize: 26}}/>
                        </div>
                    </div>
                    <div className="chat-content-send-frame-msg">
                        <textarea>
                        </textarea>
                    </div>
                    <div className="chat-content-send-frame-operation-bottom">
                        <CustomButton width={10}>
                            <i className={`iconfont icon icon-yuyin`} style={{fontSize: 14}}/>
                        </CustomButton>
                        <CustomButton width={40}>发送</CustomButton>
                    </div>
                </div>
            </div>
        </div>
    )
}