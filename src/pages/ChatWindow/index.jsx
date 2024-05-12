import "./index.less"
import CommonChatFrame from "../../componets/CommonChatFrame/index.jsx";
import WindowOperation from "../../componets/WindowOperation/index.jsx";

export default function ChatWindow() {
    return (
        <div className="chat-window-container">
            <div className="chat-window">
                <CommonChatFrame/>
                <WindowOperation hide={false}/>
            </div>
        </div>
    )
}