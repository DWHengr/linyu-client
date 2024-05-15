import "./index.less"
import CustomButton from "../../../../componets/CustomButton/index.jsx";
import CustomTextarea from "../../../../componets/CustomTextarea/index.jsx";
import IconMinorButton from "../../../../componets/IconMinorButton/index.jsx";
import {useHistory} from "react-router-dom";
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";

export default function DetailTalk() {
    let h = useHistory();

    let item =
        {
            user: {
                portrait: "",
                name: "小红"
            },
            content: {
                describe: "又是疲劳的一天",
                media: [
                    {
                        type: "img",
                        mediaContent: "https://th.bing.com/th/id/OIP.kt5NiXbTpov01ELs6cs8tQHaEo?rs=1&pid=ImgDetMain"
                    }
                ],
            },
            time: "20分钟前",
            like: {
                num: 10,
                likeContent: []
            },
            comment: {
                num: 10,
                commentContent: [
                    "小蓝：今天怎么了",
                    "小蓝：今天工作很忙么？"
                ]
            }
        }


    return (
        <CustomDragDiv className="all-talk-container">
            <div
                style={{position: "absolute", top: 15, left: 10}}
                onClick={() => h.push("/home/talk/all")}
            >
                <IconMinorButton icon={<i className={"iconfont icon-fanhui"} style={{fontSize: 24}}/>}/>
            </div>
            <div className="talks">
                <div className="talk">
                    <div className="talk-title">
                        <div className="talk-title-portrait"></div>
                        <div className="talk-title-info">
                            <div className="talk-title-info-name">{item.user.name}</div>
                            <div className="talk-title-info-time">{item.time}</div>
                        </div>
                    </div>
                    <div className="talk-content">
                        <div>{item.content.describe}</div>
                        {item.content.media?.map((mediaItem) => {
                            return (
                                <img
                                    className="talk-content-img"
                                    src={mediaItem.mediaContent}
                                />
                            )
                        })}
                    </div>
                    <div className="talk-bottom">
                        <div className="talk-bottom-operation">
                            <div className="talk-bottom-operation-item">
                                <i className={`iconfont icon-star`}
                                   style={{fontSize: 14, marginRight: 4, color: "#4C9BFF"}}/>
                                <div>已点赞（{item.like.num}）</div>
                            </div>
                            <div className="talk-bottom-operation-item">
                                <div>评论（{item.comment.num}）</div>
                            </div>
                        </div>
                        <CustomTextarea>
                            <div style={{display: "flex", alignItems: "end", justifyContent: "end", margin: 5}}>
                                <CustomButton width={60}>发送</CustomButton>
                            </div>
                        </CustomTextarea>
                        <div>
                            {item.comment.commentContent?.map((commentItem) => {
                                return <div>
                                    {commentItem}
                                </div>
                            })}
                        </div>
                    </div>
                </div>
            </div>
        </CustomDragDiv>
    )
}