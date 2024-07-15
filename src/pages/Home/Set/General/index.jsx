import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import CustomLine from "../../../../componets/CustomLine/index.jsx";
import CustomDropdown from "../../../../componets/CustomDropdown/index.jsx";
import CustomSwitch from "../../../../componets/CustomSwitch/index.jsx";
import {useState} from "react";

export default function General() {
    const sendMsgOptions =
        [
            {label: "Enter", value: "enter"},
            {label: "Alt + Enter", value: "altEnter"}
        ]
    const [isBootstrap, setIsBootstrap] = useState(false)

    return (
        <div className="general">
            <CustomDragDiv className="general-title">
                <div>通用</div>
            </CustomDragDiv>
            <div className="general-content">
                <div className="set-item">
                    <div className="set-item-label">聊天</div>
                    <div className="set-item-options">
                        <div className="set-item-option">
                            <div>发送消息</div>
                            <CustomDropdown
                                options={sendMsgOptions}
                                defaultValue="Enter"
                                onSelect={() => {
                                }}
                            />
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>输入"/"时唤起</div>
                            <div>表情</div>
                        </div>
                    </div>
                </div>
                <div className="set-item">
                    <div className="set-item-label">登录设置</div>
                    <div className="set-item-options">
                        <div className="set-item-option">
                            <div>开机自启</div>
                            <CustomSwitch isOn={isBootstrap} handleToggle={(v) => setIsBootstrap(v.target.checked)}/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}