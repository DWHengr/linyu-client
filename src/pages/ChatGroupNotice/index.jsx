import "./index.less"
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import CustomBox from "../../componets/CustomBox/index.jsx";
import {useEffect, useRef, useState} from "react";
import {getItem} from "../../utils/storage.js";
import ChatGroupApi from "../../api/chatGroup.js";
import ChatGroupNoticeApi from "../../api/chatGroupNotice.js";
import CustomButton from "../../componets/CustomButton/index.jsx";
import {formatTime} from "../../utils/date.js";
import CustomAffirmModal from "../../componets/CustomAffirmModal/index.jsx";
import CustomLine from "../../componets/CustomLine/index.jsx";
import {useToast} from "../../componets/CustomToast/index.jsx";
import {invoke} from "@tauri-apps/api/core";

export default function ChatGroupNotice() {
    const [groupNotices, setGroupNotices] = useState([])
    const [groupId, setGroupId] = useState(null)
    const [groupDetails, setGroupDetails] = useState(null)
    const [isNoticeDelAffirmModalOpen, setIsNoticeDelAffirmModalOpen] = useState(false)
    const [isEdit, setIsEdit] = useState(false)
    const [noticeContent, setNoticeContent] = useState("")
    const [currentUserId, setCurrentUserId] = useState(null)
    const [selectNoticeId, setSelectNoticeId] = useState(null)
    const showToast = useToast()

    const onGroupDetails = () => {
        ChatGroupApi.details({chatGroupId: groupId}).then(res => {
            if (res.code === 0) {
                setGroupDetails(res.data)
            }
        })
    }
    const onGroupNotices = () => {
        ChatGroupNoticeApi.list({groupId: groupId}).then(res => {
            if (res.code === 0) {
                setGroupNotices(res.data)
            }
        })
    }

    const onCreateNotice = () => {
        if (!noticeContent) return
        ChatGroupNoticeApi.create({groupId: groupId, content: noticeContent}).then(res => {
            if (res.code === 0) {
                showToast("发布成功~")
                setIsEdit(false)
                setNoticeContent("")
                onGroupNotices()
            }
        })
    }

    const onEditNotice = () => {
        if (!noticeContent) return
        ChatGroupNoticeApi.update({
            groupId: groupId,
            noticeId: selectNoticeId,
            noticeContent: noticeContent
        }).then(res => {
            if (res.code === 0) {
                showToast("编辑成功~")
                setSelectNoticeId(null)
                setIsEdit(false)
                setNoticeContent("")
                onGroupNotices()
            }
        })
    }

    const onDelNotice = () => {
        ChatGroupNoticeApi.delete({groupId: groupId, noticeId: selectNoticeId}).then(res => {
            if (res.code === 0) {
                showToast("删除成功~")
                setIsNoticeDelAffirmModalOpen(false)
                setSelectNoticeId(null)
                onGroupNotices()
            }
        })
    }

    useEffect(() => {
        if (groupId) {
            onGroupDetails()
            onGroupNotices()
        }
    }, [groupId])

    useEffect(() => {
        invoke("get_user_info", {}).then(res => {
            setCurrentUserId(res.user_id)
        })
        getItem("notice").then(res => {
            setGroupId(res.groupId)
        })
    }, [])

    return (<CustomBox>
        <WindowOperation
            hide={false}
            height={40}
            isMaximize={false}
        />
        <CustomAffirmModal
            isOpen={isNoticeDelAffirmModalOpen}
            txt="确认删除该条公告?"
            onOk={onDelNotice}
            onCancel={() => setIsNoticeDelAffirmModalOpen(false)}
        />
        <CustomDragDiv className="chat-group-notice">
            {/*公告列表*/}
            {!isEdit && <CustomDragDiv className="notices">
                <CustomDragDiv className="notices-title">
                    <CustomDragDiv style={{fontWeight: 600, userSelect: "none"}}>{groupDetails?.name}</CustomDragDiv>
                    {currentUserId === groupDetails?.ownerUserId && <CustomButton onClick={() => setIsEdit(true)}>
                        发布新公告
                    </CustomButton>}
                </CustomDragDiv>
                <CustomDragDiv className="notices-content">
                    {groupNotices?.map(notice => {
                        return (<div key={notice.id} className="notice-item">
                            <div className="item-title">
                                <img alt="" src={notice.portrait} className="item-portrait"/>
                                <div style={{marginRight: 5}}>{notice.name}</div>
                                <div>{formatTime(notice.createTime)}</div>
                                <div style={{display: "flex", marginLeft: 5}}>
                                    <div className="item-operation"
                                         onClick={() => {
                                             setSelectNoticeId(notice.id)
                                             setNoticeContent(notice.noticeContent)
                                             setIsEdit(true)
                                         }}
                                    >
                                        <i className={`iconfont icon-bianji`} style={{fontSize: 18}}/>
                                    </div>
                                    <div className="item-operation"
                                         onClick={() => {
                                             setSelectNoticeId(notice.id)
                                             setIsNoticeDelAffirmModalOpen(true)
                                         }}>
                                        <i className={`iconfont icon-shanchu`} style={{fontSize: 18}}/>
                                    </div>
                                </div>
                            </div>
                            <div>
                                {notice.noticeContent}
                            </div>
                        </div>)
                    })}
                </CustomDragDiv>
            </CustomDragDiv>}
            {/*编辑公告*/}
            {isEdit && <CustomDragDiv className="edit">
                <CustomDragDiv className="edit-title">
                    发布公告
                </CustomDragDiv>
                <CustomLine width={1}/>
                <div style={{display: "flex", flex: 1, marginTop: 5, marginBottom: 5}}>
                    <textarea value={noticeContent}
                              onChange={(v) => setNoticeContent(v.target.value)}
                              placeholder="请填写公告~"/>
                </div>
                <CustomLine width={1}/>
                <div style={{display: "flex", justifyContent: "end", alignItems: "center", marginTop: 10}}>
                    <CustomButton width={80} onClick={() => {
                        if (selectNoticeId)
                            onEditNotice()
                        else onCreateNotice()
                    }}>
                        发布
                    </CustomButton>
                    <CustomButton type="minor" width={80}
                                  onClick={() => {
                                      setSelectNoticeId(null)
                                      setNoticeContent("")
                                      setIsEdit(false)
                                  }}>
                        取消
                    </CustomButton>
                </div>
            </CustomDragDiv>}
        </CustomDragDiv>
    </CustomBox>)

}