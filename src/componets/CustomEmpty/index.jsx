export default function CustomEmpty({placeholder = "搜索结果为空~"}) {
    return (
        <div style={{
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
        }}>
            <img style={{width: 130, height: 80}} src="/empty.svg" alt="empty"/>
            <div style={{fontSize: 14, marginBottom: 200}}>{placeholder}</div>
        </div>
    )
}