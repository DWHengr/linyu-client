import "./index.less"
import {useEffect, useState} from "react";

export default function SystemMsg({value}) {
    const [systemMsgList, setSystemMsgList] = useState([])
    useEffect(() => {
        setSystemMsgList(JSON.parse(value.content))
    }, [value])
    return (
        <div className="chat-content-system-msg">
            <div className="content">
                {
                    systemMsgList?.map(msg => {
                        return (
                            <>
                                {msg.isEmphasize ?
                                    <span style={{color: "#4C9BFF", fontWeight: 600}}> {msg.content} </span> :
                                    <span> {msg.content} </span>
                                }
                            </>
                        )
                    })
                }
            </div>
        </div>
    )
}