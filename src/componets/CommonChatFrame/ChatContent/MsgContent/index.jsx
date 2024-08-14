import Text from "../Text/index.jsx";
import FileContent from "../File/index.jsx";
import Img from "../Img/index.jsx";
import Retraction from "../Retraction/index.jsx";
import Voice from "../Voice/index.jsx";
import Call from "../Call/index.jsx";

export const MsgContent = ({msg, userId, onReedit}) => {
    let isRight = msg.fromId === userId
    switch (msg.msgContent?.type) {
        case "text": {
            return <Text
                value={msg.msgContent?.content}
                right={isRight}
            />
        }
        case "file": {
            return <FileContent
                value={msg}
                right={isRight}
            />
        }
        case "img": {
            return <Img
                value={msg}
                right={isRight}
            />
        }
        case "retraction": {
            return <Retraction
                value={msg}
                onReedit={onReedit}
                right={isRight}
            />
        }
        case "voice": {
            return <Voice
                value={msg}
                right={isRight}
            />
        }
        case "call": {
            return <Call
                value={msg}
                right={isRight}
            />
        }
    }
}