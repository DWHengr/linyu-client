import "./index.less"
import {memo} from "react";

const Text = memo(({value, right = false}) => {
    const emojiRegex = /([\uD800-\uDBFF][\uDC00-\uDFFF])/;
    const parts = value.split(emojiRegex);
    return (
        <>
            <div className={"chat-content-msg"}>
                <div className={`content  ${right ? "right" : ""}`}>
                    {
                        parts.map((part, index) =>
                            emojiRegex.test(part) ? (
                                <span key={index}
                                      style={{fontSize: '20px', display: 'inline', verticalAlign: "middle"}}>
                                    {part}
                                </span>
                            ) : (
                                <span key={index} style={{display: 'inline', verticalAlign: "middle"}}>
                                    {part}
                                </span>
                            )
                        )
                    }
                </div>
            </div>
        </>
    )
})
export default Text;