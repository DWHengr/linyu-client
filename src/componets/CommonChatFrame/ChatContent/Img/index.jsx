import "./index.less"
import {memo, useEffect, useRef, useState} from "react";
import MessageApi from "../../../../api/message.js";
import CreateImageViewer from "../../../../pages/ImageViewer/window.jsx";

const Img = memo(({value, right = false}) => {
    const [imgInfo, setImgInfo] = useState(null)
    const fileInfo = useRef()

    useEffect(() => {
        fileInfo.current = JSON.parse(value.msgContent?.content)
        MessageApi.getImg({
            msgId: value.id,
        }).then((value) => {
            setImgInfo(URL.createObjectURL(value))
        })
    }, [value])

    return (
        <>
            <div className={"chat-content-img"}>
                <div className={`content  ${right ? "right" : ""}`}>
                    <img
                        style={{width: "100%", height: "100%", objectFit: "cover"}}
                        src={imgInfo}
                        alt=""
                        onClick={() => CreateImageViewer(fileInfo.current.name, imgInfo)}
                    />
                </div>
            </div>
        </>
    )
})
export default Img;