import "./index.less"
import CustomSearchInput from "../../../componets/CustomSearchInput/index.jsx";
import {useState} from "react";
import CustomAccordion from "../../../componets/CustomAccordion/index.jsx";
import RightClickMenu from "../../../componets/RightClickMenu/index.jsx";
import IconButton from "../../../componets/IconButton/index.jsx";
import IconMinorButton from "../../../componets/IconMinorButton/index.jsx";

export default function Friend() {
    const [selectedFriendId, setSelectedFriendId] = useState("1")
    const [groupMenuPosition, setGroupMenuPosition] = useState(null);
    const [groupMenuVisible, setMGroupMenuVisible] = useState(null);

    const groupRightOptions = [
        {key: "addGroup", label: "添加分组"},
        {key: "modifyGroup", label: "重命名分组"},
        {key: "deleteGroup", label: "删除分组"},
    ]

    let allFriendData = [
        {group: "特别关心", content: [{id: 1, name: "元气少女", remark: "小红"}]},
        {
            group: "销售部",
            content: [
                {id: 2, name: "元气少女222222222222222222222222223122222222222", remark: "小红"},
                {id: 3, name: "元气少女", remark: "小红"},
                {id: 4, name: "元气少女", remark: "小红"}
            ]
        },
        {group: "企业一部", content: []},
    ]

    const FriendCard = ({info, onClick, onContextMenu}) => {
        let isSelected = info.id === selectedFriendId
        return (
            <div
                className={`friend-card ${isSelected ? "selected" : ""}`}
                onClick={() => onClick(info)}
                onContextMenu={(e) => {
                    e.preventDefault()
                    if (onContextMenu) onContextMenu(e)
                }}
            >
                <div className="friend-card-portrait"></div>
                <div className="friend-card-content">
                    <div className="friend-card-content-item">
                        <div
                            style={{
                                fontSize: 14,
                                fontWeight: 600,
                                color: `${isSelected ? "#FFF" : "1F1F1F"}`,
                            }}
                            className="ellipsis"
                        >
                            {info.remark ? info.remark + "（" + info.name + ")" : info.name}
                        </div>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div className="friend">
            <div className="friend-list">
                <div data-tauri-drag-region className="friend-list-top">
                    <label className="friend-list-top-title">
                        好有列表
                        <div className="friend-list-top-title-end">
                            <IconMinorButton
                                icon={<i className={`iconfont icon-tianjia`} style={{fontSize: 22}}/>}
                            />

                        </div>
                    </label>
                    <div>
                        <CustomSearchInput></CustomSearchInput>
                    </div>
                </div>
                <RightClickMenu visible={groupMenuVisible} position={groupMenuPosition} options={groupRightOptions}/>
                <div
                    onScroll={e => {
                        setMGroupMenuVisible({visible: false})
                    }}
                    className="friend-list-items">
                    {
                        allFriendData.map(item => {
                            return (
                                <>
                                    <CustomAccordion
                                        title={item.group}
                                        titleEnd={`（${item.content ? item.content.length : 0}）`}
                                        onContextMenu={(e) => setGroupMenuPosition({x: e.clientX, y: e.clientY})}
                                    >
                                        {
                                            item?.content?.map((friend) => {
                                                return (
                                                    <FriendCard
                                                        info={friend}
                                                        onClick={() => setSelectedFriendId(friend.id)}
                                                    />
                                                )
                                            })
                                        }
                                    </CustomAccordion>
                                </>
                            )
                        })
                    }
                </div>
            </div>
            <div className="friend-content"></div>
        </div>
    )
}