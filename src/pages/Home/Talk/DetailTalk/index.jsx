import "./index.less"
import CustomButton from "../../../../componets/CustomButton/index.jsx";
import CustomTextarea from "../../../../componets/CustomTextarea/index.jsx";
import IconMinorButton from "../../../../componets/IconMinorButton/index.jsx";
import {useHistory, useLocation} from "react-router-dom";
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import TalkApi from "../../../../api/talk.js";
import {formatTime} from "../../../../utils/date.js";
import CustomImg from "../../../../componets/CustomImg/index.jsx";
import {invoke} from "@tauri-apps/api/core";
import CustomAffirmModal from "../../../../componets/CustomAffirmModal/index.jsx";
import {useToast} from "../../../../componets/CustomToast/index.jsx";
import TalkLikeApi from "../../../../api/talkLike.js";
import TalkCommentApi from "../../../../api/talkComment.js";

export default function DetailTalk() {
    let h = useHistory()
    const location = useLocation()
    const [talk, setTalk] = useState(location.state?.talk)
    const [isComment, setIsComment] = useState(false)
    const currentUserId = useRef("")
    const currentDelTalkId = useRef(0)
    const [isTalkDelAffirmModalOpen, setIsTalkDelAffirmModalOpen] = useState(false)
    const showToast = useToast()
    const [talkLikeList, setTalkLikeList] = useState([])
    const [isLike, SetIsLike] = useState(false)
    const [talkCommentList, setTalkCommentList] = useState([])
    const [commentValue, setCommentValue] = useState("")
    const talksRef = useRef(null)


    useEffect(() => {
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
            onTalkLikeList()
            onTalkCommentList()
        })
    }, [])

    useEffect(() => {
        SetIsLike(false)
        for (let i = 0; i < talkLikeList?.length; i++) {
            if (talkLikeList[i].userId === currentUserId.current) {
                SetIsLike(true)
                break
            }
        }
    }, [talkLikeList])

    useEffect(() => {
        if (isComment) {
            const container = talksRef.current
            container.scrollTop = container.scrollHeight;
        }
    }, [isComment])

    const handlerUpdateTalk = (key, value) => {
        let allTalk = location.state.allTalk
        for (let i = 0; i < allTalk?.length; i++) {
            if (allTalk[i].talkId === talk.talkId) {
                allTalk[i][key] = value
                break
            }
        }
    }
    const onTalkLikeList = () => {
        TalkLikeApi.list({talkId: talk.talkId}).then(res => {
            if (res.code === 0) {
                setTalkLikeList(res.data)
            }
        })
    }

    const onTalkCommentList = () => {
        TalkCommentApi.list({talkId: talk.talkId}).then(res => {
            if (res.code === 0) {
                setTalkCommentList(res.data)
            }
        })
    }

    const onDeleteTalk = () => {
        TalkApi.delete({talkId: talk.talkId}).then(res => {
            if (res.code === 0) {
                showToast("删除成功~")
                h.push("/home/talk/all", location.state)
            }
        })
    }

    const onDeleteTalkLike = () => {
        TalkLikeApi.delete({talkId: talk.talkId}).then(res => {
            if (res.code === 0) {
                onTalkLikeList()
                setTalk({...talk, likeNum: talk.likeNum - 1})
                handlerUpdateTalk("likeNum", talk.likeNum - 1)
            }
        })
    }

    const onDeleteTalkComment = () => {
        TalkCommentApi.delete({talkId: talk.talkId}).then(res => {
            if (res.code === 0) {
                onTalkCommentList()
                setTalk({...talk, commentNum: talk.commentNum - 1})
                handlerUpdateTalk("commentNum", talk.commentNum - 1)
            }
        })
    }

    const onCreateTalkLike = () => {
        TalkLikeApi.create({talkId: talk.talkId}).then(res => {
            if (res.code === 0) {
                onTalkLikeList()
                setTalk({...talk, likeNum: talk.likeNum + 1})
                handlerUpdateTalk("likeNum", talk.likeNum + 1)
            }
        })
    }

    const onCreateTalkComment = () => {
        TalkCommentApi.create({talkId: talk.talkId, comment: commentValue}).then(res => {
            if (res.code === 0) {
                showToast("评论成功~")
                setCommentValue("")
                onTalkCommentList()
                setTalk({...talk, commentNum: talk.commentNum + 1})
                handlerUpdateTalk("commentNum", talk.commentNum + 1)
            }
        })
    }

    return (
        <CustomDragDiv className="all-talk-container">
            <CustomAffirmModal
                isOpen={isTalkDelAffirmModalOpen}
                txt="确认删除该条说说?"
                onOk={onDeleteTalk}
                onCancel={() => setIsTalkDelAffirmModalOpen(false)}
            />
            <div
                style={{position: "absolute", top: 15, left: 10}}
                onClick={() => h.push("/home/talk/all", location.state)}
            >
                <IconMinorButton icon={<i className={"iconfont icon-fanhui"} style={{fontSize: 24}}/>}/>
            </div>
            <div className="talks" ref={talksRef}>
                <div className="talk">
                    <div className="talk-title">
                        <img className="talk-title-portrait" src={talk.portrait}/>
                        <div className="talk-title-info">
                            <div className="talk-title-info-name">{talk.remark ? talk.remark : talk.name}</div>
                            <div className="talk-title-info-time">{formatTime(talk.time)}</div>
                        </div>
                    </div>
                    <div className="talk-content">
                        <div>{talk.content.text}</div>
                        <div style={{display: "flex"}}>
                            {talk.content.img?.map((imgItem, index) => {
                                return (
                                    <CustomImg key={talk.talkId + "" + index}
                                               param={{fileName: imgItem, targetId: talk.userId}}/>
                                )
                            })}
                        </div>
                    </div>
                    <div className="talk-bottom">
                        <div className="talk-bottom-operation">
                            <div style={{display: "flex"}}>
                                <div className="talk-bottom-operation-item" onClick={() => {
                                    if (isLike) {
                                        onDeleteTalkLike()
                                    } else {
                                        onCreateTalkLike()
                                    }
                                }}>
                                    {isLike && <i className={`iconfont icon-star`}
                                                  style={{fontSize: 14, marginRight: 4, color: "#4C9BFF"}}/>
                                    }
                                    <div>{`${isLike ? "已" : ""}点赞（${talk.likeNum}）`}</div>
                                </div>
                                <div
                                    className="talk-bottom-operation-item"
                                    onClick={() => setIsComment(!isComment)}
                                >
                                    <div>评论（{talk.commentNum}）</div>
                                </div>
                            </div>
                            {currentUserId.current === talk.userId ?
                                <div
                                    style={{color: "#4C9BFF"}}
                                    className="talk-bottom-operation-item"
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        currentDelTalkId.current = talk.talkId
                                        setIsTalkDelAffirmModalOpen(true)
                                    }}
                                >
                                    删除
                                </div> : ""}
                        </div>
                        <div style={{display: "flex", marginBottom: 5, flexWrap: "wrap"}}>
                            {talkLikeList?.map(like => {
                                return (
                                    <div key={like.id} className="like-content-item">
                                        <img alt="" style={{
                                            width: 20,
                                            height: 20,
                                            borderRadius: 20,
                                            marginRight: 5
                                        }}
                                             src={like.portrait}/>
                                        <div
                                            className="ellipsis"
                                        >
                                            {like.remark ? like.remark : like.name}
                                        </div>

                                    </div>
                                )
                            })}
                        </div>
                        <div style={{marginTop: 5, marginBottom: 5}}>
                            {talkCommentList?.map((comment) => {
                                return <div
                                    style={{
                                        overflowWrap: "break-word",
                                        backgroundColor: "#fff",
                                        marginBottom: 5,
                                        borderRadius: 15,
                                        padding: 10
                                    }}>
                                    <div style={{display: "flex", alignItems: "center", height: 30}}>
                                        <img alt="" style={{
                                            width: 25,
                                            height: 25,
                                            borderRadius: 25,
                                        }}
                                             src={comment.portrait}/>
                                        <div style={{display: "flex", flexDirection: "column", marginLeft: 5}}>
                                            <div
                                                style={{fontSize: 10, lineHeight: "18px"}}
                                            >{comment.remark ? comment.remark : comment.name}</div>
                                            <div style={{
                                                fontSize: 8,
                                                color: "#969696",
                                                lineHeight: "10px"
                                            }}>{formatTime(comment.createTime)}</div>
                                        </div>
                                    </div>
                                    <div>
                                        {comment.content}
                                    </div>
                                </div>
                            })}
                        </div>
                        {isComment && <CustomTextarea value={commentValue} onChange={(v) => setCommentValue(v)}>
                            <div
                                style={{display: "flex", alignItems: "end", justifyContent: "end", margin: 5}}
                            >
                                <CustomButton width={60} onClick={onCreateTalkComment}>发送</CustomButton>
                            </div>
                        </CustomTextarea>}
                    </div>
                </div>
            </div>
        </CustomDragDiv>
    )
}