import "./index.less"
import CustomSearchInput from "../../../componets/CustomSearchInput/index.jsx";
import {useEffect, useState} from "react";
import RightClickMenu from "../../../componets/RightClickMenu/index.jsx";
import CommonChatFrame from "../../../componets/CommonChatFrame/index.jsx";
import CreateChatWindow from "../../ChatWindow/window.jsx";
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import ChatListApi from "../../../api/chatList.js";

export default function Chat() {

    const [selectedChatId, setSelectedChatId] = useState(null)
    const [menuPosition, setMenuPosition] = useState(null);
    const [rightSelected, setRightSelected] = useState(null)
    const [topChatsData, setTopChatsData] = useState([])
    const [allChatsData, setAllChatsData] = useState([])

    useEffect(() => {
        ChatListApi.list().then(res => {
            if (res.code === 0) {
                setTopChatsData(res.data.tops)
                setAllChatsData(res.data.others)
            }
        })
    }, []);

    const chatListRightOptions = [
        {key: "top", label: "置顶"},
        {key: "unTop", label: "取消置顶"},
        {key: "unNoDisturb", label: "设置免打扰"},
        {key: "unNoDisturb ", label: "取消免打扰"},
        {key: "newChatWindow", label: "打开独立窗口"},
        {key: "deleteChat", label: "从聊天列表中移除"},
    ]

    const onMenuItemClick = (item) => {
        switch (item.key) {
            case "newChatWindow" : {
                CreateChatWindow(rightSelected)
            }
        }
    }

    const ChatCard = ({info, onClick, onContextMenu}) => {
        let isSelected = info.fromId === selectedChatId
        return (
            <div
                className={`chat-card ${isSelected ? "selected" : ""}`}
                onClick={() => onClick(info)}
                onContextMenu={(e) => {
                    e.preventDefault()
                    if (onContextMenu) onContextMenu(e)
                }}
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
                            className="ellipsis"
                        >
                            {info.remark ? info.remark : info.name}</div>
                        <div style={{
                            fontSize: 10,
                            color: `${isSelected ? "#F6F6F6" : "#646464"}`
                        }}>{info.updateTime}</div>
                    </div>
                    <div className="chat-card-content-item">
                        <div
                            style={{fontSize: 12, color: `${isSelected ? "#F6F6F6" : "#646464"}`}}
                            className="ellipsis"
                        >
                            {info.lastMsgContent.content}
                        </div>
                        {
                            info.unreadNum > 0 ? <div style={{
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
                <CustomDragDiv className="chat-list-top">
                    <label className="chat-list-top-title">聊天列表</label>
                    <div>
                        <CustomSearchInput></CustomSearchInput>
                    </div>
                </CustomDragDiv>
                <RightClickMenu
                    position={menuPosition}
                    options={chatListRightOptions}
                    onMenuItemClick={onMenuItemClick}
                />
                <div
                    className="chat-list-items">
                    {topChatsData?.length > 0 && <div className="chat-list-items-label">置顶</div>}
                    {
                        topChatsData.map(data => {
                            return (
                                <ChatCard
                                    onContextMenu={(e) => {
                                        setRightSelected(data.id)
                                        setMenuPosition({x: e.clientX, y: e.clientY})
                                    }}
                                    info={data}
                                    onClick={() => setSelectedChatId(data.fromId)}
                                />
                            )
                        })
                    }
                    <div className="chat-list-items-label">全部</div>
                    {
                        allChatsData.map(data => {
                            return (
                                <ChatCard
                                    onContextMenu={(e) => {
                                        setRightSelected(data.id)
                                        setMenuPosition({x: e.clientX, y: e.clientY})
                                    }}
                                    info={data}
                                    onClick={() => setSelectedChatId(data.fromId)}
                                />
                            )
                        })

                    }
                </div>
            </div>
            <CommonChatFrame userId={selectedChatId}/>
        </div>
    )
}