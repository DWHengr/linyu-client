import "./index.less"
import IconMinorButton from "../IconMinorButton/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import Time from "./ChatContent/Time/index.jsx";
import Msg from "./ChatContent/Msg/index.jsx";

export default function CommonChatFrame() {
    return (

        <div className="common-chat-content">
            <div data-tauri-drag-region className="chat-content-title">
                <div>
                    <div style={{
                        width: 40,
                        height: 40,
                        backgroundColor: "#4C9BFF",
                        borderRadius: 50,
                        marginLeft: 10
                    }}>
                    </div>
                </div>
                <div style={{
                    fontWeight: 600,
                    color: "#1F1F1F",
                    marginLeft: 10,
                }}>
                    小红
                </div>
            </div>
            <div className="chat-content-show-frame">
                <Time value="昨天 20:20"/>
                <Msg value="睡觉了"/>
                <Msg value="今天就先不说了"/>
                <Msg value="好的" right/>
            </div>
            <div className="chat-content-send-frame">
                <div className="chat-content-send-frame-operation">
                    <div style={{display: "flex"}}>
                        <IconMinorButton
                            icon={<i className={`iconfont icon icon-biaoqing`} style={{fontSize: 24}}/>}/>
                        <IconMinorButton
                            icon={<i className={`iconfont icon icon-wenjian`} style={{fontSize: 26}}/>}/>
                        <IconMinorButton
                            icon={<i className={`iconfont icon icon-jilu`} style={{fontSize: 22}}/>}/>
                    </div>
                    <div style={{display: "flex"}}>
                        <IconMinorButton
                            icon={<i className={`iconfont icon icon-dianhua`} style={{fontSize: 24}}/>}/>
                        <IconMinorButton
                            icon={<i className={`iconfont icon icon-shipin`} style={{fontSize: 26}}/>}/>
                    </div>
                </div>
                <div className="chat-content-send-frame-msg">
                        <textarea>
                        </textarea>
                </div>
                <div className="chat-content-send-frame-operation-bottom">
                    <CustomButton width={10}>
                        <i className={`iconfont icon icon-yuyin`} style={{fontSize: 14}}/>
                    </CustomButton>
                    <CustomButton width={40}>发送</CustomButton>
                </div>
            </div>
        </div>
    )
}