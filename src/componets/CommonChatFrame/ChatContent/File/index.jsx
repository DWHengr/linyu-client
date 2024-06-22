import "./index.less"
import {memo, useEffect, useRef, useState} from "react";
import ProgressBar from "../../../ProgressBar/index.jsx";
import {save} from "@tauri-apps/plugin-dialog";
import {download} from "@tauri-apps/plugin-upload";
import {getFileNameAndType} from "../../../../utils/string.js";
import {invoke} from "@tauri-apps/api/core";
import {useDispatch, useSelector} from "react-redux";
import {setFileFileProgress} from "../../../../store/home/action.js";
import MessageApi from "../../../../api/message.js";

const File = memo(({value, right = false}) => {
    const homeStoreData = useSelector(store => store.homeData)
    const [msg, setMsg] = useState(value)
    const [fileInfo, setFileInfo] = useState(JSON.parse(value.msgContent?.content))
    const [progress, setProgress] = useState(0)
    const dispatch = useDispatch()
    const isRefresh = useRef(true)

    function formatSize(size) {
        if (size < 1024) {
            return size + ' B';
        }
        let units = ['KB', 'MB', 'GB', 'TB'];
        let i = -1;
        while (size >= 1024 && i < units.length - 1) {
            size /= 1024;
            i++;
        }
        return size.toFixed(1) + ' ' + units[i];
    }

    useEffect(() => {
        let p = homeStoreData.fileProgress[msg.id]
        if (p) setProgress(p)
    }, [])

    useEffect(() => {
        let p = homeStoreData.fileProgress[msg.id]
        if (p) setProgress(p)
    }, [homeStoreData])

    const onDownload = async () => {
        let sum = 1;
        let userinfo = await invoke("get_user_info", {})
        const {fileName, fileType} = getFileNameAndType(fileInfo.url)
        save({
            title: "林语",
            defaultPath: fileName,
            filters: [
                {name: "文件", extensions: [fileType]}
            ]
        }).then((path) => {
            MessageApi.getFile({
                    msgId: msg.id,
                    path: path
                },
                (payload) => {
                    sum += payload.progress
                    if (isRefresh.current) {
                        isRefresh.current = false
                        let p = sum / fileInfo.size * 100
                        dispatch(setFileFileProgress(msg.id, p))
                        setTimeout(function () {
                            isRefresh.current = true
                        }, 1000);
                    }
                    if (sum >= fileInfo.size) {
                        dispatch(setFileFileProgress(msg.id, 100))
                    }
                }
            )
        })

    }

    return (
        <>
            <div
                className={"chat-content-file"}
            >
                <div
                    onClick={onDownload}
                    className={`content  ${right ? "right" : "left"}`}
                >
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", width: "100%"}}>
                        <div>
                            <div className="ellipsis" style={{width: 140}}>
                                {fileInfo?.name}
                            </div>
                            <div style={{fontSize: 10}}>
                                {formatSize(fileInfo?.size)}
                            </div>
                        </div>
                        <div style={{
                            width: 50,
                            height: 50,
                            borderRadius: 50,
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center"
                        }}>
                            {right ?
                                <img style={{height: 50}} src="/file-upload.png" alt=""/> :
                                <img style={{height: 50}} src="/file-download.png" alt=""/>
                            }
                        </div>
                    </div>
                    {progress > 0 && <ProgressBar progress={progress}/>}
                </div>
            </div>
        </>
    )
})
export default File;