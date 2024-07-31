import "./index.less"
import {memo, useEffect, useRef, useState} from "react";
import MessageApi from "../../../../api/message.js";
import CustomAudio from "../../../CustomAudio/index.jsx";

const Voice = memo(({value, right = false}) => {
    const [info, setInfo] = useState(null)
    const infoRef = useRef(null)
    const fileInfo = useRef()
    const [audioTime, setAudioTime] = useState(0)
    const interval = useRef(null)
    const [retryNum, setRetryNum] = useState(0)
    const retryNumRef = useRef(0)

    useEffect(() => {
        fileInfo.current = JSON.parse(value.msgContent?.content)
        setAudioTime(fileInfo.current.time)
        MessageApi.getMedia({
            msgId: value.id,
        }).then((res) => {
            infoRef.current = res?.data
            setInfo(res?.data)
        })
        if (interval.current) clearInterval(interval.current)
        interval.current = setInterval(() => {
            if (retryNumRef.current > 60) {
                clearInterval(interval.current)
                return
            }
            setInfo(infoRef.current)
            retryNumRef.current = retryNumRef.current + 1
            setRetryNum(retryNumRef.current)
        }, 1000)
    }, [value])

    return (
        <>
            <div className={"chat-content-voice"}>
                <div className={`content  ${right ? "right" : ""}`}>
                    {info &&
                        <CustomAudio
                            type={right ? "" : "minor"}
                            key={retryNum}
                            audioUrl={info}
                            time={audioTime}
                            onLoadedMetadata={() => clearInterval(interval.current)}
                        />
                    }
                </div>
            </div>
        </>
    )
})
export default Voice;