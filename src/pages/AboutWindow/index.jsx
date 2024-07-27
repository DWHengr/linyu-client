import "./index.less"
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";

export default function AboutWindow() {
    return (
        <CustomDragDiv className="about-container">
            <WindowOperation
                hide={false}
                height={40}
                isMaximize={false}
            />
            <CustomDragDiv className="about">
                <div className="about-wave"></div>
                <div className="about-wave"></div>
                <div className="about-wave"></div>
                <div style={{zIndex: 100, display: "flex", flexDirection: "column", alignItems: "center"}}>
                    <img data-tauri-drag-region style={{maxHeight: 200, maxWidth: 200, userSelect: "none"}}
                         src="/logo.png" alt=""/>
                    <img data-tauri-drag-region
                         style={{maxHeight: 80, maxWidth: 80, userSelect: "none", marginBottom: 30}} src="/linyu.png"
                         alt=""/>
                    <div>
                        开源地址：https://github.com/DWHengr/linyu-client
                    </div>
                    <div style={{color: "#9599a3"}}>
                        作者：Heath
                    </div>
                    <div style={{color: "#9599a3"}}>
                        QQ群：729158695
                    </div>
                    <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 30,
                        color: "#9599a3",
                        userSelect: "none"
                    }}>
                        基于 <img style={{height: 20, margin: "0 10px"}} src="/tauri.svg" alt=""/> 框架
                    </div>
                </div>
            </CustomDragDiv>
        </CustomDragDiv>
    )
}