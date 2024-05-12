import "./index.less"

export default function Time({value}) {
    return (
        <div className="chat-content-time">
            <div className="content">
                {value}
            </div>
        </div>
    )
}