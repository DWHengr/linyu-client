import "./index.less"
import CustomDragDiv from "../../../../componets/CustomDragDiv/index.jsx";
import IconMinorButton from "../../../../componets/IconMinorButton/index.jsx";
import {useHistory} from "react-router-dom";
import CustomLine from "../../../../componets/CustomLine/index.jsx";
import CustomButton from "../../../../componets/CustomButton/index.jsx";
import Dropzone from "react-dropzone";
import {useState} from "react";
import CreateImageViewer from "../../../ImageViewer/window.jsx";
import TalkApi from "../../../../api/talk.js";
import {useToast} from "../../../../componets/CustomToast/index.jsx";

export default function CreateTalk() {
    let h = useHistory()
    const [text, setText] = useState("")
    const [imgs, setImgs] = useState([])
    const showToast = useToast()

    const handlerUploadImg = (acceptedFiles) => {
        let newImgs = [...imgs]
        acceptedFiles.forEach((file) => {
            const reader = new FileReader()
            reader.onload = () => {
                newImgs.push({
                    fileName: file.name,
                    data: reader.result,
                    file: file
                })
                setImgs(newImgs)
            }
            reader.readAsDataURL(file)

        })
    }

    const handlerDeleteImg = (index) => {
        const newImgs = [...imgs];
        newImgs.splice(index, 1);
        setImgs(newImgs);
    }

    const onCreateTalk = () => {
        let uploadNum = 0
        TalkApi.create({text: text}).then(res => {
            if (res.code === 0) {
                let talkId = res.data.id
                imgs.map(img => {
                    TalkApi.uploadImg(img.file, {talkId}).then(res => {
                        if (res.code === 0) {
                            uploadNum++
                        }
                        if (uploadNum === imgs.length) {
                            showToast("发表成功~")
                            setText("")
                            setImgs([])
                        }
                    })
                })
            }
        })
    }

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
                    <textarea placeholder="记录当前的时刻..." value={text}
                              onChange={(e) => setText(e.target.value)}>
                    </textarea>
                </div>
                <div className="create-talk-media">
                    {
                        imgs.map((item, index) => {
                            return (
                                <div className="create-talk-media-item">
                                    <div
                                        className="create-talk-media-item-img-operate"
                                        onClick={() => handlerDeleteImg(index)}
                                    >
                                        <i className={`iconfont icon-guanbi`} style={{fontSize: 16}}/>
                                    </div>
                                    <img
                                        key={index}
                                        className="create-talk-media-item"
                                        src={item.data} alt=""
                                        onClick={() => CreateImageViewer(item.fileName, item.data)}
                                    />
                                </div>
                            )
                        })
                    }
                    <Dropzone
                        onDrop={(acceptedFiles) => handlerUploadImg(acceptedFiles)}
                        accept={
                            {
                                'image/*': ['.png'],
                            }
                        }
                    >
                        {({getRootProps, getInputProps}) => (
                            <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div className="create-talk-media-add">
                                    <i className={"iconfont icon-tianjia2"} style={{fontSize: 60, color: "#949393"}}/>
                                </div>
                            </div>
                        )}
                    </Dropzone>
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
                <CustomButton onClick={onCreateTalk} width={60} disabled={!text}>发表</CustomButton>
            </div>
        </CustomDragDiv>
    )
}