import "./index.less"
import CustomSearchInput from "../../../componets/CustomSearchInput/index.jsx";
import {useState} from "react";
import CustomAccordion from "../../../componets/CustomAccordion/index.jsx";
import RightClickMenu from "../../../componets/RightClickMenu/index.jsx";
import IconMinorButton from "../../../componets/IconMinorButton/index.jsx";
import CustomLine from "../../../componets/CustomLine/index.jsx";
import CustomButton from "../../../componets/CustomButton/index.jsx";

export default function Friend() {
    const [selectedFriendId, setSelectedFriendId] = useState("1")
    const [groupMenuPosition, setGroupMenuPosition] = useState(null);
    const [addMenuPosition, setAddMenuPosition] = useState(null);
    const [moreMenuPosition, setMoreMenuPosition] = useState(null);

    const groupRightOptions = [
        {key: "addGroup", label: "添加分组"},
        {key: "modifyGroup", label: "重命名分组"},
        {key: "deleteGroup", label: "删除分组"}
    ]

    const addRightOptions = [
        {key: "addFriend", label: "添加好友"},
    ]

    const moreRightOptions = [
        {key: "careFor", label: "特别关心"},
        {key: "unCaraFor", label: "取消特别关心"},
        {key: "delFriend", label: "删除好有"},
    ]

    let allFriendData = [{group: "特别关心", content: [{id: 1, name: "元气少女", remark: "小红"}]}, {
        group: "销售部", content: [{id: 2, name: "元气少女222222222222222222222222223122222222222", remark: "小红"}, {
            id: 3, name: "元气少女", remark: "小红"
        }, {id: 4, name: "元气少女", remark: "小红"}]
    }, {group: "企业一部", content: []},]

    const FriendCard = ({info, onClick, onContextMenu}) => {
        let isSelected = info.id === selectedFriendId
        return (<div
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
                            fontSize: 14, fontWeight: 600, color: `${isSelected ? "#FFF" : "1F1F1F"}`,
                        }}
                        className="ellipsis"
                    >
                        {info.remark ? info.remark + "（" + info.name + ")" : info.name}
                    </div>
                </div>
            </div>
        </div>)
    }

    return (
        <div className="friend">
            <RightClickMenu position={addMenuPosition} options={addRightOptions}/>
            <RightClickMenu position={groupMenuPosition} options={groupRightOptions}/>
            <RightClickMenu position={moreMenuPosition} options={moreRightOptions}/>
            <div className="friend-list">
                <div data-tauri-drag-region className="friend-list-top">
                    <label className="friend-list-top-title">
                        好有列表
                        <div className="friend-list-top-title-end"
                             onClick={(e) => setAddMenuPosition({x: e.clientX, y: e.clientY})}>
                            <IconMinorButton
                                icon={<i className={`iconfont icon-tianjia`} style={{fontSize: 22}}/>}
                            />
                        </div>
                    </label>
                    <div>
                        <CustomSearchInput></CustomSearchInput>
                    </div>
                </div>
                <div
                    className="friend-list-items">
                    {allFriendData.map(item => {
                        return (<>
                            <CustomAccordion
                                title={item.group}
                                titleEnd={`（${item.content ? item.content.length : 0}）`}
                                onContextMenu={(e) => setGroupMenuPosition({x: e.clientX, y: e.clientY})}
                            >
                                {item?.content?.map((friend) => {
                                    return (<FriendCard
                                        info={friend}
                                        onClick={() => setSelectedFriendId(friend.id)}
                                    />)
                                })}
                            </CustomAccordion>
                        </>)
                    })}
                </div>
            </div>
            <div data-tauri-drag-region className="friend-content">
                <div className="friend-content-container">
                    <div className="friend-content-container-top">
                        <div className="friend-content-container-top-info">
                            <div className="info-icon"></div>
                            <div className="info-content">
                                <div style={{display: "flex", justifyContent: "space-between"}}>
                                    <div style={{fontSize: 30, fontWeight: 600, letterSpacing: 2}}>小红</div>
                                    <div style={{display: "flex", alignItems: "center"}}>
                                        <i className={`iconfont icon-star`} style={{fontSize: 22, color: "#4C9BFF"}}/>
                                        <IconMinorButton
                                            onClick={(e) => setMoreMenuPosition({x: e.clientX, y: e.clientY})}
                                            icon={<i className={`iconfont icon-gengduo`} style={{fontSize: 32}}/>}
                                        />
                                    </div>
                                </div>
                                <div>
                                    <div style={{fontSize: 16, color: "#989898"}}>昵称：元气少女</div>
                                    <div style={{fontSize: 16, color: "#989898"}}>账号：xiaohong</div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="friend-content-container-mid">
                        <div className="info-item">
                            <i className={`iconfont icon-nv`} style={{fontSize: 14, marginRight: 5, color: "#FFA0CF"}}/>
                            <div>女</div>
                            <CustomLine size={12} width={1} direction="vertical"/>
                            <div>18岁</div>
                            <CustomLine size={12} width={1} direction="vertical"/>
                            <div>9月20日</div>
                        </div>
                        <div className="info-item">
                            <i className={`iconfont icon-beizhu`} style={{fontSize: 14, marginRight: 5}}/>
                            <div>备注：</div>
                            <div>小红</div>
                        </div>
                        <div className="info-item">
                            <i className={`iconfont icon-fenzu`} style={{fontSize: 14, marginRight: 5}}/>
                            <div>分组：</div>
                            <div>财务部</div>
                        </div>
                        <div className="info-item">
                            <i className={`iconfont icon-qianming`} style={{fontSize: 14, marginRight: 5}}/>
                            <div>签名：</div>
                            <div>不一样的小红花</div>
                        </div>
                        <div className="info-item">
                            <div style={{display: "flex", flexDirection: "column"}}>
                                <div style={{display: "flex"}}>
                                    <i className={`iconfont icon-pengyouquan`} style={{fontSize: 14, marginRight: 5}}/>
                                    <div>朋友圈：</div>
                                </div>
                                <div>
                                    <div>今天天气不错！</div>
                                    <div style={{width: 100, height: 100}}>
                                        <img
                                            style={{width: "100%", height: "100%", objectFit: "cover", borderRadius: 5}}
                                            src="https://th.bing.com/th/id/OIP.kt5NiXbTpov01ELs6cs8tQHaEo?rs=1&pid=ImgDetMain"
                                        />
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                    <div className="friend-content-container-bottom">
                        <div style={{display: "flex"}}>
                            <CustomButton type="" width={100}>发消息</CustomButton>
                            <CustomButton type="minor" width={100}>视频聊天</CustomButton>
                        </div>
                    </div>
                </div>
            </div>
        </div>)
}