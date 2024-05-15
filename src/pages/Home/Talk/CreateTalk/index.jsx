import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import IconMinorButton from "../../../../componets/IconMinorButton/index.jsx";
import {useHistory} from "react-router-dom";
import CustomLine from "../../../../componets/CustomLine/index.jsx";
import CustomButton from "../../../../componets/CustomButton/index.jsx";

export default function CreateTalk() {
    let h = useHistory();

    return (
        <CustomDragDiv className="create-talk-container">
            <div
                style={{position: "absolute", top: 15, left: 10}}
                onClick={() => h.push("/home/talk/all")}
            >
                <IconMinorButton icon={<i className={"iconfont icon-fanhui"} style={{fontSize: 24}}/>}/>
            </div>
            <div className="create-talk">
                <div>
                    <textarea placeholder="记录当前的时刻..."></textarea>
                </div>
                <div className="create-talk-media">
                    <div className="create-talk-media-add">
                        <i className={"iconfont icon-tianjia2"} style={{fontSize: 60, color: "#949393"}}/>
                    </div>
                </div>
                <CustomLine width={1}></CustomLine>
                <div className="create-talk-operation">
                    <div className="create-talk-operation-item ">
                        <div style={{display: "flex", alignItems: "center"}}>
                            <i className={"iconfont icon-haoyou"} style={{fontSize: 14, marginRight: 5}}/>
                            <div>可以给谁看</div>
                        </div>
                        <div>
                            <div style={{display: "flex", alignItems: "center"}}>
                                <div>所有</div>
                                <i className={"iconfont icon-weixiala"} style={{fontSize: 14}}/>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div style={{display: "flex", justifyContent: "end", width: "600px"}}>
                <CustomButton width={60}>发表</CustomButton>
            </div>
        </CustomDragDiv>
    )
}