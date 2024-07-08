import "./index.less"
import CustomButton from "../../../../componets/CustomButton/index.jsx";
import {useHistory, useLocation} from "react-router-dom";
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import TalkApi from "../../../../api/talk.js";
import CustomImg from "../../../../componets/CustomImg/index.jsx";
import {formatTime} from "../../../../utils/date.js";
import CustomEmpty from "../../../../componets/CustomEmpty/index.jsx";
import {invoke} from "@tauri-apps/api/core";
import CustomAffirmModal from "../../../../componets/CustomAffirmModal/index.jsx";
import {useToast} from "../../../../componets/CustomToast/index.jsx";

export default function AllTalk() {
    let h = useHistory();
    const talkListDataRef = useRef([])
    const [talkListData, setTalkListData] = useState([])
    const loading = useRef(false)
    const talksRef = useRef(null)
    const isQueryComplete = useRef(false)
    const currentNum = useRef(0)
    const currentUserId = useRef("")
    const [isTalkDelAffirmModalOpen, setIsTalkDelAffirmModalOpen] = useState(false)
    const currentDelTalkId = useRef(0)
    const showToast = useToast()
    const location = useLocation()
    const cache = location.state

    useEffect(() => {
        invoke("get_user_info", {}).then(res => {
            currentUserId.current = res.user_id
            if (cache) {
                setTalkListData(cache?.allTalk)
            } else {
                onGetTalkList()
            }
        })
    }, [])

    useEffect(() => {
        if (talksRef.current && cache) {
            setTalkListData(cache?.allTalk)
            const container = talksRef.current
            container.scrollTop = cache.scrollTop
        }
    }, [talkListData])

    const onGetTalkList = () => {
        loading.current = true
        TalkApi.list({index: currentNum.current, num: 10}).then(res => {
            if (res.code === 0) {
                if (res.data?.length > 0) {
                    talkListDataRef.current = [...talkListDataRef.current, ...res.data]
                    console.log(talkListDataRef.current)
                    setTalkListData(talkListDataRef.current)
                    currentNum.current += res.data?.length
                } else {
                    isQueryComplete.current = true
                }
            }
            loading.current = false
        })
    }

    useEffect(() => {
        const handleScroll = () => {
            if (talksRef.current) {
                const {scrollTop, scrollHeight, clientHeight} = talksRef.current;
                if (!isQueryComplete.current && scrollTop + clientHeight >= scrollHeight && !loading.current) {
                    onGetTalkList()
                }
            }
        };

        const container = talksRef.current;
        if (container) {
            container.addEventListener('scroll', handleScroll);
        }

        return () => {
            if (container) {
                container.removeEventListener('scroll', handleScroll);
            }
        };
    }, []);

    const onDeleteTalk = () => {
        TalkApi.delete({talkId: currentDelTalkId.current}).then(res => {
            if (res.code === 0) {
                showToast("删除成功~")
                let newTalkListData = talkListDataRef.current.filter(item => item.talkId !== currentDelTalkId.current)
                setTalkListData(newTalkListData)
                setIsTalkDelAffirmModalOpen(false)
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
            <div style={{position: "absolute", top: 20, left: 10}}>
                <CustomButton onClick={() => h.push("/home/talk/create", {
                    allTalk: talkListData,
                    scrollTop: talksRef.current.scrollTop
                })}>说一说</CustomButton>
            </div>
            {talkListData?.length > 0 && <div className="float-container">
                <div className="operate" onClick={() => talksRef.current.scrollTop = 0}>
                    <i className={`iconfont icon icon-zhiding`} style={{fontSize: 30}}/>
                </div>
            </div>}
            <div ref={talksRef} className="talks">
                {talkListData?.map((item) => {
                    return (
                        <div
                            key={item.talkId}
                            className="talk"
                            onClick={() => h.push({
                                pathname: "/home/talk/detail",
                                state: {talk: item, allTalk: talkListData, scrollTop: talksRef.current.scrollTop}
                            })}
                        >
                            <div className="talk-title">
                                <img className="talk-title-portrait" src={item.portrait}/>
                                <div className="talk-title-info">
                                    <div className="talk-title-info-name">{item.remark ? item.remark : item.name}</div>
                                    <div className="talk-title-info-time">{formatTime(item.time)}</div>
                                </div>
                            </div>
                            <div className="talk-content">
                                <div>{item.content.text}</div>
                                <div style={{display: "flex"}}>
                                    {item.content.img?.map((imgItem, index) => {
                                        return (
                                            <CustomImg key={item.talkId + "" + index}
                                                       param={{fileName: imgItem, targetId: item.userId}}/>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="talk-bottom">
                                <div className="talk-bottom-operation">
                                    <div style={{display: "flex"}}>
                                        <div className="talk-bottom-operation-item">
                                            <div>点赞数（{item.likeNum}）</div>
                                        </div>
                                        <div className="talk-bottom-operation-item">
                                            <div>评论数（{item.commentNum}）</div>
                                        </div>
                                    </div>
                                    {currentUserId.current === item.userId ?
                                        <div
                                            style={{color: "#4C9BFF"}}
                                            className="talk-bottom-operation-item"
                                            onClick={(e) => {
                                                e.stopPropagation()
                                                currentDelTalkId.current = item.talkId
                                                setIsTalkDelAffirmModalOpen(true)
                                            }}
                                        >
                                            删除
                                        </div> : ""}
                                </div>
                                <div>
                                    {item.latestComment?.map((comment) => {
                                        return <div>
                                            {comment.name} : {comment.content}
                                        </div>
                                    })}
                                </div>
                                <div style={{color: "#4C9BFF"}}>
                                    查看更多内容
                                </div>
                            </div>

                        </div>)
                })}
                {talkListData?.length <= 0 &&
                    // < CustomDragDiv style={{
                    //     display: "flex",
                    //     flex: 1,
                    //     alignItems: "center",
                    //     justifyContent: "center",
                    //     height: "100%"
                    // }}>
                    //     <img style={{height: 120}} src="/bg.png" alt=""/>
                    // </CustomDragDiv>
                    <CustomEmpty placeholder="暂时无人发表说说~"/>
                }
            </div>
        </CustomDragDiv>
    )
}