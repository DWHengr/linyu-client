import {formatTimingTime} from "../../utils/date.js";

export default function MsgContentShow({msgContent}) {
    if (!msgContent) return
    switch (msgContent.type) {
        case "text": {
            return <>{msgContent.content}</>
        }
        case "file": {
            let content = JSON.parse(msgContent.content)
            return <>[文件] {content.name}</>
        }
        case "img": {
            return <>[图片]</>
        }
        case "retraction": {
            return <>[消息被撤回]</>
        }
        case "voice": {
            let content = JSON.parse(msgContent.content)
            return <div>[语音] {content.time}"</div>
        }
        case "call": {
            let content = JSON.parse(msgContent.content)
            return <div>[通话] {content?.time > 0 ? formatTimingTime(content?.time) : "未接通"}</div>
        }
    }
}