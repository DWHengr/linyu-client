import "./index.less"

export default function GroupQuit({value}) {
    return (
        <div className="chat-content-group-quit">
            <div className="content">
                <span style={{color: "#4C9BFF", fontWeight: 600}}>{value}</span> 已退出该群
            </div>
        </div>
    )
}