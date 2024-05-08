import "./index.less"

export default function Msg({value, right = false}) {
    return (
        <>
            <div className={"chat-content-msg"}>
                <div className={`content  ${right ? "right" : ""}`}>
                    {value}
                </div>
            </div>
        </>
    )
}