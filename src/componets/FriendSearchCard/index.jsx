import "./index.less"
const FriendSearchCard = ({info, onClick}) => {
    return (
        <div
            className={`friend-search-card`}
            onClick={onClick}
            onContextMenu={(e) => {
                e.preventDefault()
                if (onContextMenu) onContextMenu(e)
            }}
        >
            <img className="friend-search-card-portrait" src={info.portrait}
                 alt={info.portrait}/>
            <div className="friend-search-card-content">
                <div className="friend-search-card-content-item">
                    <div
                        style={{
                            fontSize: 14,
                            fontWeight: 600,
                        }}
                        className="ellipsis"
                    >
                        {info.remark ? info.remark + "（" + info.name + ")" : info.name}
                    </div>
                </div>
                <div className="friend-search-card-content-item">
                    <div
                        style={{fontSize: 12, color: "646464"}}
                        className="ellipsis"
                    >
                        账号：{info.account}
                    </div>
                </div>
            </div>
        </div>
    )
}
export default FriendSearchCard