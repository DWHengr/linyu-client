export default function MsgContentShow({msgContent}) {
    if (!msgContent) return
    switch (msgContent.type) {
        case "text": {
            return <> {msgContent.content}</>
        }
        case "file": {
            let fileInfo = JSON.parse(msg.content)
            return <>[文件] {fileInfo.name}</>
        }
        case "img": {
            return <>[图片]</>
        }
        case "retraction": {
            return <>[消息被撤回]</>
        }
    }
}