import "./index.less"
import CustomSearchInput from "../../../componets/CustomSearchInput/index.jsx";
import {useState} from "react";

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
                <div className="chat-content-title">
                </div>
            </div>
        </div>
    )
}