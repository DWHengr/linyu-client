import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import CustomLine from "../../../../componets/CustomLine/index.jsx";
import CustomShortcutInput from "../../../../componets/CustomShortcutInput/index.jsx";

export default function Shortcut() {

    return (
        <div className="shortcut-set">
            <CustomDragDiv className="shortcut-set-title">
                <div>快捷键</div>
            </CustomDragDiv>
            <div className="shortcut-set-content">
                <div className="set-item">
                    <div className="set-item-options">
                        <div className="set-item-option">
                            <div>截图</div>
                            <CustomShortcutInput/>
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>打开未读会话</div>
                            <CustomShortcutInput/>
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>隐藏/显示主面板</div>
                            <CustomShortcutInput/>
                        </div>
                        <CustomLine width={1}/>
                        <div className="set-item-option">
                            <div>关闭会话窗口</div>
                            <CustomShortcutInput/>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}