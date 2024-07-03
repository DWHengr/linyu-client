import "./index.less"
import CustomButton from "../../../../componets/CustomButton/index.jsx";
import {useHistory} from "react-router-dom";
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import {useEffect, useState} from "react";
import TalkApi from "../../../../api/talk.js";
import CustomImg from "../../../../componets/CustomImg/index.jsx";
import {formatTime} from "../../../../utils/date.js";
import CustomEmpty from "../../../../componets/CustomEmpty/index.jsx";

export default function AllTalk() {
    let h = useHistory();
    const [talkListData, setTalkListData] = useState([])

    useEffect(() => {
        TalkApi.list({index: 0, num: 10}).then(res => {
            if (res.code === 0) {
                setTalkListData(res.data)
            }
        })
    }, [])

    return (
        <CustomDragDiv className="all-talk-container">
            <div style={{position: "absolute", top: 20, left: 10}}>
                <CustomButton onClick={() => h.push("/home/talk/create")}>说一说</CustomButton>
            </div>
            <div className="talks">
                {talkListData?.map((item) => {
                    return (
                        <div
                            key={item.id}
                            className="talk"
                            onClick={() => h.push("/home/talk/detail")}
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
                                    {item.content.img?.map((imgItem) => {
                                        return (
                                            <CustomImg param={{fileName: imgItem, targetId: item.userId}}/>
                                        )
                                    })}
                                </div>
                            </div>
                            <div className="talk-bottom">
                                <div className="talk-bottom-operation">
                                    <div className="talk-bottom-operation-item">
                                        <div>已点赞（{item.likeNum}）</div>
                                    </div>
                                    <div className="talk-bottom-operation-item">
                                        <div>评论（{item.commentNum}）</div>
                                    </div>
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