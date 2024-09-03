import "./index.less"
import {memo} from "react";

const Retraction = memo(({value, right = false, onReedit}) => {

    return (
        <>
            <div className="chat-content-retraction">
                <div>{`${right ? "你" : "对方"}撤回了一条消息`}</div>
                {right && value?.msgContent?.ext === "text" &&
                    < div
                        style={{color: "#4C9BFF", marginLeft: 5, cursor: "pointer"}}
                        onClick={() => {
                            if (onReedit) onReedit(value)
                        }}
                    >
                        重新编辑
                    </div>
                }
            </div>
        </>
    )
})
export default Retraction;