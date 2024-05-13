import "./index.less"

export default function Talk() {

    let talkAllData = [
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
        },
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
            time: "",
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
        },
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
            time: "",
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
        },
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
            time: "",
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
    ]

    return (
        <div data-tauri-drag-region className="talk-container">
            <div style={{position: "absolute", top: 10, left: 10}}>说一说</div>
            <div className="talks">
                {
                    talkAllData?.map((item) => {
                        return (
                            <div className="talk">
                                <div style={{display: "flex", alignItems: "center"}}>
                                    <div
                                        style={{width: 45, height: 45, backgroundColor: "#4C9BFF", borderRadius: 40}}>
                                    </div>
                                    <div style={{
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "center",
                                        marginLeft: 5
                                    }}>
                                        <div style={{fontSize: 20, lineHeight: "24px"}}>{item.user.name}</div>
                                        <div style={{fontSize: 10, lineHeight: "10px"}}>{item.time}</div>
                                    </div>
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    backgroundColor: "white",
                                    padding: 5,
                                    marginTop: 10,
                                    borderRadius: 15,
                                    fontSize: 14

                                }}>
                                    <div>{item.content.describe}</div>
                                    {
                                        item.content.media?.map((mediaItem) => {
                                            return (
                                                <div style={{width: 100, height: 100}}>
                                                    <img
                                                        style={{width: "100%", height: "100%", objectFit: "cover"}}
                                                        src={mediaItem.mediaContent}
                                                    />
                                                </div>
                                            )
                                        })
                                    }
                                </div>
                                <div style={{
                                    display: "flex",
                                    flexDirection: "column",
                                    fontSize: 12,
                                    userSelect: "none"
                                }}>
                                    <div style={{display: "flex", marginTop: 10}}>
                                        <div style={{display: "flex"}}>
                                            <i className={`iconfont icon-star`}
                                               style={{fontSize: 14, marginRight: 5, color: "#4C9BFF"}}/>
                                            <div>已点赞（{item.like.num}）</div>
                                        </div>
                                        <div style={{display: "flex"}}>
                                            <div>评论（{item.comment.num}）</div>
                                        </div>
                                    </div>
                                    <div>
                                        {
                                            item.comment.commentContent?.map((commentItem) => {
                                                return <div>
                                                    {commentItem}
                                                </div>
                                            })
                                        }
                                    </div>
                                    <div style={{color: "#4C9BFF"}}>
                                        查看更多全部内容
                                    </div>
                                </div>

                            </div>
                        )
                    })
                }
            </div>
        </div>
    )
}