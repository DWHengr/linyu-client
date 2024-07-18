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
    }
}