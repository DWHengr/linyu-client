import "./index.less"
import {memo, useEffect, useRef, useState} from "react";
import MessageApi from "../../../../api/message.js";
import CreateImageViewer from "../../../../pages/ImageViewer/window.jsx";

const Img = memo(({value, right = false}) => {
    const [imgInfo, setImgInfo] = useState(null)
    const imgInfoRef = useRef(null)
    const fileInfo = useRef()
    const [isLoaded, setIsLoaded] = useState(false)
    const interval = useRef(null)
    const [retryNum, setRetryNum] = useState(0)
    const retryNumRef = useRef(0)

    useEffect(() => {
        fileInfo.current = JSON.parse(value.msgContent?.content)
        MessageApi.getMedia({
            msgId: value.id,
        }).then((res) => {
            imgInfoRef.current = res?.data
            setImgInfo(res?.data)
        })
        if (interval.current) clearInterval(interval.current)
        interval.current = setInterval(() => {
            if (retryNumRef.current > 60) {
                clearInterval(interval.current)
                return
            }
            setImgInfo(imgInfoRef.current)
            retryNumRef.current = retryNumRef.current + 1
            setRetryNum(retryNumRef.current)
        }, 1000)

    }, [value])

    return (
        <>
            <div className={"chat-content-img"}>
                <div className={`content  ${right ? "right" : ""}`}>
                    {!isLoaded ? (
                        <div className="loading-spinner"></div>
                    ) : null}
                    {imgInfo && <img
                        key={retryNum}
                        style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            display: `${!isLoaded ? 'none' : ''}`
                        }}
                        src={imgInfo}
                        onLoad={() => {
                            clearInterval(interval.current)
                            setIsLoaded(true)
                        }}
                        alt="加载失败"
                        onClick={() => CreateImageViewer(fileInfo.current.name, imgInfo)}
                    />}
                </div>
            </div>
        </>
    )
})
export default Img;