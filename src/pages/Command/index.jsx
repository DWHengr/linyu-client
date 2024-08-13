import "./index.less"
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import {useEffect, useRef, useState} from "react";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import FocusLock from 'react-focus-lock';
import {useToast} from "../../componets/CustomToast/index.jsx";

export default function Command() {
    const cmdIndexRef = useRef(1)
    const [cmdIndex, setCmdIndex] = useState(1)
    const [cmdOne, setCmdOne] = useState("")
    const [cmdTwo, setCmdTwo] = useState("")
    const [inputValue, setInputValue] = useState("")
    const inputRef = useRef(null);
    const [placeholder, setPlaceholder] = useState("")
    const showToast = useToast()

    const cmdOneList = [
        {
            key: 'send',
            describe: '发送 消息给用户~'
        },
        {
            key: 'open',
            describe: '打开 用户聊天窗口~'
        }
    ]

    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape' || event.keyCode === 27) {
                WebviewWindow.getCurrent().hide()
            }
        };
        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, [])

    const handlerCmdOne = (cmd) => {
        for (let i = 0; i < cmdOneList.length; i++) {
            if (cmdOneList[i].key === cmd) {
                setCmdOne(cmd)
                cmdIndexRef.current = 2
                inputRef.current.focus()
                return
            }
        }
        showToast(`[ ${cmd} ]命令不存在~`, true)
    }
    const handleKeyDown = (event) => {
        if (event.key === 'Enter') {
            switch (cmdIndexRef.current) {
                case 1: {
                    handlerCmdOne(inputValue)
                    break
                }
                case 2: {
                    setCmdTwo(inputValue)
                    cmdIndexRef.current = cmdIndexRef.current + 1
                    break
                }
                case 3: {
                    setCmdTwo(inputValue)
                    break
                }
            }
            setInputValue("")
        }
        if (event.key === 'Backspace') {
            if (!inputValue && cmdIndexRef.current > 1) {
                cmdIndexRef.current = cmdIndexRef.current - 1
                switch (cmdIndexRef.current) {
                    case 1: {
                        setCmdOne("")
                        break
                    }
                    case 2: {
                        setCmdTwo("")
                        break
                    }
                }
            }
        }
    }

    useEffect(() => {
        setCmdIndex(cmdIndexRef.current)
        switch (cmdIndexRef.current) {
            case 1: {
                setPlaceholder("请输入命令~")
                break
            }
            case 2: {
                setPlaceholder("请输入用户名/备注/账号~")
                break
            }
            case 3: {
                setPlaceholder("请输入发送的消息~")
                break
            }
        }
    }, [cmdIndexRef.current])

    return (
        <div className="command-window-container">
            <FocusLock>
                <CustomDragDiv className="command-window">
                    <CustomDragDiv className="command-box">
                        {cmdOne &&
                            <div className="command-one">
                                {cmdOne}
                            </div>}
                        {cmdTwo &&
                            <div className="command-two">
                                小娜
                            </div>}
                        <div className="command-input">
                            <input
                                ref={inputRef}
                                placeholder={placeholder}
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                            />
                        </div>
                        <img alt="" src="/logo.png" style={{width: 50, height: 50, marginLeft: 5, flexShrink: 0}}/>
                    </CustomDragDiv>
                    <CustomDragDiv className="content">
                        {
                            cmdIndex === 1 &&
                            <div>
                                {
                                    cmdOneList?.map((item, index) => {
                                        return <div
                                            key={index} className="cmd-item"
                                            tabIndex="0"
                                            onKeyDown={(event) => {
                                                if (event.key === 'Enter')
                                                    handlerCmdOne(item.key)
                                            }}
                                            onClick={() => handlerCmdOne(item.key)}
                                        >
                                            <div style={{
                                                fontSize: 24,
                                                marginRight: 10,
                                                fontWeight: 600
                                            }}>{item.key}</div>
                                            <div style={{fontSize: 14, lineHeight: '14px'}}>{item.describe}</div>
                                        </div>
                                    })
                                }
                            </div>
                        }
                        {
                            cmdIndex === 2 && <div>
                                2
                            </div>
                        }
                        {
                            cmdIndex === 3 && <div>
                                3
                            </div>
                        }
                    </CustomDragDiv>
                </CustomDragDiv>
            </FocusLock>
        </div>
    )
}