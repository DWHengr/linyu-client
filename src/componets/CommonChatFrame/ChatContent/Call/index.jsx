import "./index.less"
import {memo, useEffect, useState} from "react";
import {formatTimingTime} from "../../../../utils/date.js";

const Call = memo(({value, right = false}) => {
    let [msgContent, setMsgContent] = useState(null)

    useEffect(() => {
        let content = JSON.parse(value.msgContent?.content)
        setMsgContent(content)
    }, [value])

    return (
        <>
            <div className={"chat-content-call"}>
                <div className={`content  ${right ? "right" : ""}`}>
                    <i className={`iconfont icon ${msgContent?.type === "audio" ? "icon-dianhua" : "icon-shipin"}`}
                       style={{fontSize: 20, margin: "0 4px"}}/>
                    <div>
                        {
                            msgContent?.time > 0 ? `通话时长 ${formatTimingTime(msgContent.time)}` : "通话未接通"
                        }
                    </div>
                </div>
            </div>
        </>
    )
})
export default Call;