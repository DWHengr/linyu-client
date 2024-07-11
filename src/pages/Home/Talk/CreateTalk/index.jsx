import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import IconMinorButton from "../../../../componets/IconMinorButton/index.jsx";
import {useHistory, useLocation} from "react-router-dom";
import CustomLine from "../../../../componets/CustomLine/index.jsx";
import CustomButton from "../../../../componets/CustomButton/index.jsx";
import Dropzone from "react-dropzone";
import {useRef, useState} from "react";
import CreateImageViewer from "../../../ImageViewer/window.jsx";
import TalkApi from "../../../../api/talk.js";
import {useToast} from "../../../../componets/CustomToast/index.jsx";
import FriendApi from "../../../../api/friend.js";
import CustomSearchInput from "../../../../componets/CustomSearchInput/index.jsx";

export default function CreateTalk() {
    let h = useHistory()
    const [text, setText] = useState("")
    const [imgs, setImgs] = useState([])
    const [isShowSelectUser, setIsShowSelectUser] = useState(false)
    const [allFriend, setAllFriend] = useState([])
    const [allGroupFriend, setAllGroupFriend] = useState([])
    const [contentFriend, setContentFriend] = useState([])
    const [currentSelectFriendId, setCurrentSelectFriendId] = useState([])
    const [currentSelectFriend, setCurrentSelectFriend] = useState([])
    const [searchUsersInfo, setSearchUsersInfo] = useState("")
    const showToast = useToast()
    const location = useLocation()

    const handlerUploadImg = (acceptedFiles) => {
        let newImgs = [...imgs]
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
                newImgs.push({
                    fileName: file.name,
                    data: reader.result,
                    file: file
                })
                setImgs(newImgs)
            }
            reader.readAsDataURL(file)

        })
    }

    const handlerDeleteImg = (index) => {
        const newImgs = [...imgs];
        newImgs.splice(index, 1);
        setImgs(newImgs);
    }

    const onCreateTalk = () => {
        TalkApi.create({text: text, permission: currentSelectFriendId}).then(res => {
            if (res.code === 0) {
                let talkId = res.data.id
                imgs.map(img => {
                    TalkApi.uploadImg(img.file, {talkId}).then(res => {
                        if (res.code === 0) {
                        }
                    })
                })
                location.state = null
                showToast("发表成功~")
                setText("")
                setImgs([])
                setCurrentSelectFriend([])
                setCurrentSelectFriendId([])
            }
        })
    }

    const handlerOpenSelectUser = (e) => {
        FriendApi.list().then(res => {
            if (res.code === 0) {
                setAllGroupFriend(res.data)
            }
        })
        FriendApi.listFlat().then(res => {
            if (res.code === 0) {
                setAllFriend(res.data)
                setContentFriend(res.data)
            }
        })
        setIsShowSelectUser(!isShowSelectUser)
    }

    const handlerSelectUser = (friend) => {
        if (!currentSelectFriendId.includes(friend.friendId)) {
            let newCurrentSelectFriendId = [...currentSelectFriendId, friend.friendId]
            setCurrentSelectFriendId(newCurrentSelectFriendId)
            let newCurrentSelectFriend = [...currentSelectFriend, friend]
            setCurrentSelectFriend(newCurrentSelectFriend)
        } else {
            let newCurrentSelectFriendId = currentSelectFriendId.filter(id => id !== friend.friendId)
            setCurrentSelectFriendId(newCurrentSelectFriendId)
            let newCurrentSelectFriend = currentSelectFriend.filter(item => item.friendId !== friend.friendId)
            setCurrentSelectFriend(newCurrentSelectFriend)
        }
    }

    const onSearchUsersInfo = (v) => {
        setSearchUsersInfo(v)
        FriendApi.listFlat({friendInfo: v}).then(res => {
            console.log("res:", res)
            if (res.code === 0) {
                setContentFriend(res.data)
            }
        })
    }

    return (
        <CustomDragDiv className="create-talk-container">
            <div
                style={{position: "absolute", top: 15, left: 10}}
                onClick={() => h.push("/home/talk/all", location.state)}
            >
                <IconMinorButton icon={<i className={"iconfont icon-fanhui"} style={{fontSize: 24}}/>}/>
            </div>
            <div className="create-talk">
                <div>
                    <textarea placeholder="记录当前的时刻..." value={text}
                              onChange={(e) => setText(e.target.value)}>
                    </textarea>
                </div>
                <div className="create-talk-media">
                    {
                        imgs.map((item, index) => {
                            return (
                                <div className="create-talk-media-item">
                                    <div
                                        className="create-talk-media-item-img-operate"
                                        onClick={() => handlerDeleteImg(index)}
                                    >
                                        <i className={`iconfont icon-guanbi`} style={{fontSize: 16}}/>
                                    </div>
                                    <img
                                        key={index}
                                        className="create-talk-media-item"
                                        src={item.data} alt=""
                                        onClick={() => CreateImageViewer(item.fileName, item.data)}
                                    />
                                </div>
                            )
                        })
                    }
                    <Dropzone
                        onDrop={(acceptedFiles) => handlerUploadImg(acceptedFiles)}
                        accept={
                            {
                                'image/*': ['.png'],
                            }
                        }
                    >
                        {({getRootProps, getInputProps}) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="create-talk-media-add">
                                    <i className={"iconfont icon-tianjia2"} style={{fontSize: 60, color: "#949393"}}/>
                                </div>
                            </div>
                        )}
                    </Dropzone>
                </div>
                <CustomLine width={1}></CustomLine>
                <div className="create-talk-operation">
                    <div className="create-talk-operation-item ">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <i className={"iconfont icon-haoyou"} style={{fontSize: 14, marginRight: 5}}/>
                            <div>可以给谁看</div>
                        </div>
                        <div style={{position: 'relative', display: 'inline-block'}}>
                            {isShowSelectUser &&
                                <div
                                    className="select-user"
                                >
                                    <div className="search">
                                        <CustomSearchInput
                                            style={{marginTop: 0, marginBottom: 0, height: 30}}
                                            value={searchUsersInfo}
                                            onChange={(v) => onSearchUsersInfo(v)}
                                            placeholder="搜索好友"
                                        />
                                        <div className="group">
                                            <div
                                                className="group-item ellipsis"
                                                onClick={() => setContentFriend(allFriend)}
                                            >
                                                全部好友
                                            </div>
                                            {allGroupFriend?.map(group => {
                                                return (
                                                    <div
                                                        className="group-item ellipsis"
                                                        key={group.id}
                                                        onClick={() => setContentFriend(group.friends)}
                                                    >
                                                        {group.name}
                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                    <div style={{display: "flex", flexDirection: "column", flex: 1}}>
                                        <div className="operate">
                                            <div className="operate-item" onClick={() => setIsShowSelectUser(false)}>
                                                <i className={`iconfont icon-guanbi`} style={{fontSize: 18}}/>
                                            </div>
                                        </div>
                                        <div className="user">
                                            {contentFriend?.map(friend => {
                                                return (
                                                    <div
                                                        className={`user-item ${currentSelectFriendId.includes(friend.friendId) ? "selected" : ""}`}
                                                        key={friend.friendId}
                                                        onClick={() => handlerSelectUser(friend)}
                                                    >
                                                        <img style={{
                                                            width: 40,
                                                            height: 40,
                                                            borderRadius: 40,
                                                            marginRight: 5
                                                        }}
                                                             src={friend.portrait}/>
                                                        <div
                                                            className="ellipsis"
                                                        >
                                                            {friend.remark ? friend.remark : friend.name}
                                                        </div>

                                                    </div>
                                                )
                                            })}
                                        </div>
                                    </div>
                                </div>
                            }
                            <div style={{display: "flex", alignItems: "center", cursor: "pointer"}}
                                 onClick={handlerOpenSelectUser}>
                                <div>{currentSelectFriend.length <= 0 ? "所有" : "部分"}</div>
                                <i className={"iconfont icon-weixiala"} style={{fontSize: 14}}/>
                            </div>
                        </div>
                    </div>
                    <div className="selected-content">
                        {currentSelectFriend?.map(friend => {
                            return (
                                <div
                                    key={friend.friendId}
                                    className="selected-content-item"
                                >
                                    <img style={{width: 16, height: 16, borderRadius: 16, marginRight: 2}}
                                         src={friend.portrait} alt=""/>
                                    <div
                                        className="ellipsis"
                                        style={{flex: 1}}>{friend.remark ? friend.remark : friend.name}
                                    </div>
                                    <i
                                        className={`iconfont icon-guanbi`}
                                        style={{fontSize: 16, cursor: "pointer", color: "#4C9BFF"}}
                                        onClick={() => handlerSelectUser(friend)}
                                    />
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "end", width: "600px"}}>
                <CustomButton onClick={onCreateTalk} width={60} disabled={!text}>发表</CustomButton>
            </div>
        </CustomDragDiv>
    )
}