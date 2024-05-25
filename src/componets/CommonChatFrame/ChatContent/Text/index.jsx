import "./index.less"
import {memo} from "react";

const Text = memo(({value, right = false}) => {
    return (
        <>
            <div className={"chat-content-msg"}>
                <div className={`content  ${right ? "right" : ""}`}>
                    {value}
                </div>
            </div>
        </>
    )
})
export default Text;