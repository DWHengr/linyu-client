import "./index.less"
import CustomSearchInput from "../../../componets/CustomSearchInput/index.jsx";
import {useEffect, useState} from "react";
import CustomAccordion from "../../../componets/CustomAccordion/index.jsx";
import RightClickMenu from "../../../componets/RightClickMenu/index.jsx";
import IconMinorButton from "../../../componets/IconMinorButton/index.jsx";
import CustomLine from "../../../componets/CustomLine/index.jsx";
import CustomButton from "../../../componets/CustomButton/index.jsx";
import {useHistory} from "react-router-dom";
import CustomDragDiv from "../../../componets/CustomDragDiv/index.jsx";
import FriendApi from "../../../api/friend.js";
import {calculateAge, getDateDayAndMonth} from "../../../utils/date.js";
import {useDispatch} from "react-redux";
import {setCurrentChatId} from "../../../store/chat/action.js";
import ChatListApi from "../../../api/chatList.js";
import {setCurrentOption} from "../../../store/home/action.js";

export default function Friend() {
    const [selectedFriendId, setSelectedFriendId] = useState("1")
    const [groupMenuPosition, setGroupMenuPosition] = useState(null)
    const [addMenuPosition, setAddMenuPosition] = useState(null)
    const [moreMenuPosition, setMoreMenuPosition] = useState(null)
    const [allFriendData, setAllFriendData] = useState([])
    const h = useHistory()
    const [friendDetails, setFriendDetails] = useState(null)
    const dispatch = useDispatch();

    useEffect(() => {
        FriendApi.list().then(res => {
            if (res.code === 0) {
                setAllFriendData(res.data)
            }
        })
    }, [])

    const groupRightOptions = [
        {key: "addGroup", label: "添加分组"},
        {key: "modifyGroup", label: "重命名分组"},
        {key: "deleteGroup", label: "删除分组"}
    ]

    const addRightOptions = [
        {key: "addFriend", label: "添加好友"},
    ]

    const moreRightOptions = [
        {key: "careFor", label: "特别关心"},
        {key: "unCaraFor", label: "取消特别关心"},
        {key: "delFriend", label: "删除好友"},
    ]

    const onFriendDetails = (friendId) => {
        if (friendId === selectedFriendId) return
        setSelectedFriendId(friendId)
        FriendApi.details(friendId).then(res => {
            if (res.code === 0) {
                setFriendDetails(res.data)
            }
        })
    }

    const onSendMsgClick = () => {
        ChatListApi.create({userId: selectedFriendId}).then(res => {
            if (res.code === 0) {
                dispatch(setCurrentChatId(selectedFriendId, res.data))
                dispatch(setCurrentOption("chat"))
                h.push("/home/chat")
            }
        })
    }

    const FriendCard = ({info, onClick, onContextMenu}) => {
        let isSelected = info.friendId === selectedFriendId
        return (<div
            className={`friend-card ${isSelected ? "selected" : ""}`}
            onClick={() => onClick(info)}
            onContextMenu={(e) => {
                e.preventDefault()
                if (onContextMenu) onContextMenu(e)
            }}
        >
            <div className="friend-card-portrait"></div>
            <div className="friend-card-content">
                <div className="friend-card-content-item">
                    <div
                        style={{
                            fontSize: 14, fontWeight: 600, color: `${isSelected ? "#FFF" : "1F1F1F"}`,
                        }}
                        className="ellipsis"
                    >
                        {info.remark ? info.remark + "（" + info.name + ")" : info.name}
                    </div>
                </div>
            </div>
        </div>)
    }

    return (
        <div className="friend">
            <RightClickMenu position={addMenuPosition} options={addRightOptions}/>
            <RightClickMenu position={groupMenuPosition} options={groupRightOptions}/>
            <RightClickMenu position={moreMenuPosition} options={moreRightOptions}/>
            <div className="friend-list">
                <CustomDragDiv className="friend-list-top">
                    <label className="friend-list-top-title">
                        好友列表
                        <div className="friend-list-top-title-end"
                             onClick={(e) => setAddMenuPosition({x: e.clientX, y: e.clientY})}>
                            <IconMinorButton
                                icon={<i className={`iconfont icon-tianjia`} style={{fontSize: 22}}/>}
                            />
                        </div>
                    </label>
                    <div>
                        <CustomSearchInput></CustomSearchInput>
                    </div>
                </CustomDragDiv>
                <div
                    className="friend-list-items">
                    {allFriendData.map(item => {
                        return (<>
                            <CustomAccordion
                                key={item.id}
                                title={item.name}
                                titleEnd={`（${item.friends ? item.friends.length : 0}）`}
                                onContextMenu={(e) => setGroupMenuPosition({x: e.clientX, y: e.clientY})}
                            >
                                {item?.friends?.map((friend) => {
                                    return (<FriendCard
                                        info={friend}
                                        onClick={() => onFriendDetails(friend.friendId)}
                                    />)
                                })}
                            </CustomAccordion>
                        </>)
                    })}
                </div>
            </div>
            {
                friendDetails ?
                    <CustomDragDiv className="friend-content">
                        <div className="friend-content-container">
                            <div className="friend-content-container-top">
                                <div className="friend-content-container-top-info">
                                    <div className="info-icon"></div>
                                    <div className="info-content">
                                        <div style={{display: "flex", justifyContent: "space-between"}}>
                                            <div style={{
                                                fontSize: 30,
                                                fontWeight: 600,
                                                letterSpacing: 2
                                            }}>{friendDetails.name}</div>
                                            <div style={{display: "flex", alignItems: "center"}}>
                                                <i className={`iconfont icon-star`}
                                                   style={{fontSize: 22, color: "#4C9BFF"}}/>
                                                <IconMinorButton
                                                    onClick={(e) => setMoreMenuPosition({x: e.clientX, y: e.clientY})}
                                                    icon={<i className={`iconfont icon-gengduo`}
                                                             style={{fontSize: 32}}/>}
                                                />
                                            </div>
                                        </div>
                                        <div>
                                            <div style={{
                                                fontSize: 16,
                                                color: "#989898"
                                            }}>账号：{friendDetails.account}</div>
                                            <div style={{height: 16}}></div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="friend-content-container-mid">
                                <div className="info-item">
                                    <i className={`iconfont ${friendDetails.sex === 'nv' ? 'icon-nv' : 'icon-nan'}`}
                                       style={{
                                           fontSize: 14,
                                           marginRight: 5,
                                           color: friendDetails.sex === 'nv' ? "#FFA0CF" : "#4C9BFF"
                                       }}/>
                                    <div>{friendDetails.sex}</div>
                                    <CustomLine size={12} width={1} direction="vertical"/>
                                    <div>{calculateAge(friendDetails.birthday)}岁</div>
                                    <CustomLine size={12} width={1} direction="vertical"/>
                                    <div>{getDateDayAndMonth(friendDetails.birthday)}</div>
                                </div>
                                <div className="info-item">
                                    <i className={`iconfont icon-beizhu`} style={{fontSize: 14, marginRight: 5}}/>
                                    <div>备注：</div>
                                    <div>{friendDetails.remark}</div>
                                </div>
                                <div className="info-item">
                                    <i className={`iconfont icon-fenzu`} style={{fontSize: 14, marginRight: 5}}/>
                                    <div>分组：</div>
                                    <div>{friendDetails.groupName}</div>
                                </div>
                                <div className="info-item">
                                    <i className={`iconfont icon-qianming`} style={{fontSize: 14, marginRight: 5}}/>
                                    <div>签名：</div>
                                    <div>{friendDetails.signature}</div>
                                </div>
                                <div className="info-item">
                                    <div style={{display: "flex", flexDirection: "column"}}>
                                        <div style={{display: "flex"}}>
                                            <i className={`iconfont icon-pengyouquan`}
                                               style={{fontSize: 14, marginRight: 5}}/>
                                            <div>朋友圈：</div>
                                        </div>
                                        <div
                                            onClick={() => {
                                                h.push("/home/talk")
                                            }}
                                        >
                                            <div>今天天气不错！</div>
                                            <div style={{width: 100, height: 100}}>
                                                <img
                                                    style={{
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover",
                                                        borderRadius: 5
                                                    }}
                                                    src="https://th.bing.com/th/id/OIP.kt5NiXbTpov01ELs6cs8tQHaEo?rs=1&pid=ImgDetMain"
                                                />
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>
                            <div className="friend-content-container-bottom">
                                <div style={{display: "flex"}}>
                                    <CustomButton type="" width={100} onClick={onSendMsgClick}>发消息</CustomButton>
                                    <CustomButton type="minor" width={100}>视频聊天</CustomButton>
                                </div>
                            </div>
                        </div>
                    </CustomDragDiv>
                    :
                    <CustomDragDiv style={{display: "flex", flex: 1, alignItems: "center", justifyContent: "center"}}>
                        <img style={{height: 120}} src="/bg.png" alt=""/>
                    </CustomDragDiv>
            }
        </div>)
}