import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import CustomLine from "../../../../componets/CustomLine/index.jsx";

export default function General() {
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
                            <div>Enter</div>
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
                            <div>是</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}