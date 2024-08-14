import CustomDragDiv from "../CustomDragDiv/index.jsx";

export default function CustomEmpty({placeholder = "搜索结果为空~"}) {
    return (
        <CustomDragDiv style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
        }}>
            <img data-tauri-drag-region style={{width: 130, height: 80}} src="/empty.svg" alt="empty"/>
            <div data-tauri-drag-region style={{fontSize: 14, marginBottom: 200}}>{placeholder}</div>
        </CustomDragDiv>
    )
}