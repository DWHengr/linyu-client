import './index.less'
import CustomEmpty from "../CustomEmpty/index.jsx";
import {useEffect, useRef, useState} from "react";
import FriendApi from "../../api/friend.js";
import CustomAccordion from "../CustomAccordion/index.jsx";
import SelectionIcon from "../CustomSelectionIcon/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import CustomSearchInput from "../CustomSearchInput/index.jsx";

export default function ChatGroupInvite({existing, onCancel, onOk}) {
    const [allFriendData, setAllFriendData] = useState([])
    const [selectedUsers, setSelectedUsers] = useState([])
    const selectedUserIds = useRef(new Set())
    const [searchValue, setSearchValue] = useState("")
    const [searchFriendData, setSearchFriendData] = useState([])

    useEffect(() => {
        onFriendList()
    }, [])

    useEffect(() => {
        if (searchValue) {
            handlerSearchFriend()
        }
    }, [searchValue])

    const handlerSearchFriend = () => {
        FriendApi.search({searchInfo: searchValue}).then(res => {
            if (res.code === 0) {
                setSearchFriendData(res.data)
            }
        })
    }

    const onFriendList = () => {
        FriendApi.list().then(res => {
            if (res.code === 0) {
                setAllFriendData(res.data)
            }
        })
    }

    const handleUserClick = (user) => {
        setSelectedUsers(prevUsers => {
            const userIndex = prevUsers.findIndex(u => u.friendId === user.friendId);
            if (userIndex === -1) {
                selectedUserIds.current.add(user.friendId)
                return [...prevUsers, user];
            } else {
                selectedUserIds.current.delete(user.friendId)
                return prevUsers.filter(u => u.friendId !== user.friendId)
            }
        });
    };

    let getSelectionIconStatus = (user) => {
        if (existing && Object.entries(existing).some(([userId]) => userId === user.friendId)) {
            return 'disabled'
        }
        if (selectedUsers.some(u => u.friendId === user.friendId)) {
            return 'selected'
        } else {
            return 'unselected'
        }
    }

    return (
        <div className="chat-group-invite-container">
            <div className="chat-group-invite">
                <div className="invite-left">
                    <CustomSearchInput
                        style={{marginTop: 4, marginBottom: 4, height: 30}}
                        placeholder="搜索好友"
                        value={searchValue}
                        onChange={(v) => setSearchValue(v)}
                    />
                    <div className="friend-list">
                        {!searchValue && allFriendData.map((item, index) => {
                            return (
                                <CustomAccordion
                                    key={item.name + index}
                                    title={item.name}
                                    titleEnd={`（${item.friends ? item.friends.length : 0}）`}
                                >
                                    {item?.friends?.map((friend) => {
                                        let status = getSelectionIconStatus(friend)
                                        return (
                                            <div
                                                key={item.groupId + "" + friend.friendId}
                                                className="friend-list-item"
                                                onClick={() => {
                                                    if (status !== 'disabled') handleUserClick(friend)
                                                }}
                                            >
                                                <SelectionIcon
                                                    status={status}
                                                    style={{width: 18, height: 18, marginRight: 5}}
                                                />
                                                <img
                                                    alt="" src={friend.portrait}
                                                    style={{width: 25, height: 25, borderRadius: 25, marginRight: 5}}
                                                />
                                                <div
                                                    style={{fontSize: 14}}>{friend.remark ? friend.remark : friend.name}
                                                </div>

                                            </div>
                                        )
                                    })}
                                </CustomAccordion>
                            )
                        })}
                        {searchValue && searchFriendData?.map((friend) => {
                            let status = getSelectionIconStatus(friend)
                            return (
                                <div
                                    key={friend.friendId}
                                    className="friend-list-item"
                                    onClick={() => {
                                        if (status !== 'disabled') handleUserClick(friend)
                                    }}
                                >
                                    <SelectionIcon
                                        status={status}
                                        style={{width: 18, height: 18, marginRight: 5}}
                                    />
                                    <img
                                        alt="" src={friend.portrait}
                                        style={{width: 25, height: 25, borderRadius: 25, marginRight: 5}}
                                    />
                                    <div
                                        style={{fontSize: 14}}>{friend.remark ? friend.remark : friend.name}
                                    </div>
                                </div>
                            )
                        })}
                        {allFriendData?.length <= 0 &&
                            <CustomEmpty placeholder="暂无好友，请先添加~"/>}
                    </div>

                </div>
                <div className="invite-right">
                    <div style={{display: "flex", justifyContent: "space-between", fontSize: 14}}>
                        <div>添加成员</div>
                        <div style={{color: "#b4b4b4", marginRight: 5}}>已选择{selectedUsers.length}个好友</div>
                    </div>
                    <div className="friend-list">
                        {selectedUsers?.map((friend) => {
                            return (
                                <div key={friend.friendId} className="friend-list-item">
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <img
                                            alt="" src={friend.portrait}
                                            style={{
                                                width: 35,
                                                height: 35,
                                                borderRadius: 40,
                                                marginRight: 5
                                            }}
                                        />
                                        <div
                                            style={{fontSize: 14}}>{friend.remark ? friend.remark : friend.name}
                                        </div>
                                    </div>
                                    <div
                                        onClick={() =>
                                            handleUserClick(friend)
                                        }
                                    >
                                        <i className={`iconfont icon icon-quxiao`} style={{fontSize: 14}}/>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                    <div style={{display: "flex", marginTop: 10, justifyContent: "end"}}>
                        <CustomButton width={80}
                                      onClick={() => onOk(Array.from(selectedUserIds.current))}>确定</CustomButton>
                        <CustomButton width={80} onClick={onCancel} type='minor'>取消</CustomButton>
                    </div>
                </div>
            </div>
        </div>
    )
}