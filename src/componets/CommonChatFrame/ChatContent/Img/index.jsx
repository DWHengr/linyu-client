import "./index.less"
import {memo, useEffect, useState} from "react";
import MessageApi from "../../../../api/message.js";
import CreateImageViewer from "../../../../pages/ImageViewer/window.jsx";

const Img = memo(({value, right = false}) => {
    const [imgInfo, setImgInfo] = useState(null)

    useEffect(() => {
        MessageApi.getImg({
            msgId: value.id,
        }).then((value) => {
            setImgInfo(URL.createObjectURL(value))
        })
    }, [])

    return (
        <>
            <div className={"chat-content-img"}>
                <div className={`content  ${right ? "right" : ""}`}>
                    <img
                        style={{width: 100}}
                        src={imgInfo}
                        alt=""
                        onClick={() => CreateImageViewer(imgInfo)}
                    />
                </div>
            </div>
        </>
    )
})
export default Img;