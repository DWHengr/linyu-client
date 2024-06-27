import Viewer from 'react-viewer';
import "./index.less"
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import {save} from "@tauri-apps/plugin-dialog";
import {useEffect, useState} from "react";
import {download} from "@tauri-apps/plugin-upload";
import {getItem} from "../../utils/storage.js";
import {writeFile} from "@tauri-apps/plugin-fs";


export default function ImageViewer() {

    const [url, setUrl] = useState("")
    const [fileName, setFileName] = useState("")

    useEffect(() => {
        getItem("image-viewer-url").then(value => {
            setFileName(value.fileName)
            setUrl(value.url)
        })
    }, [])

    function saveDialog() {
        const fileTypeMatch = fileName ? fileName.match(/(?<=\.)\w+$/) : null;
        const fileType = fileTypeMatch ? fileTypeMatch[0] : null;
        save({
            title: "林语",
            defaultPath: fileName,
            filters: [
                {name: "图片", extensions: [fileType]}
            ]
        }).then((path) => {
            fetch(url)
                .then(response => response.blob())
                .then(blob => {
                    const reader = new FileReader();
                    reader.onload = () => {
                        writeFile(path, reader.result)
                    };
                    reader.readAsArrayBuffer(blob);
                })
                .catch(error => {
                    console.error('Error fetching blob content:', error);
                });
        })

    }

    return (
        <div className="image-viewer-container">
            <div className="image-viewer">
                <CustomDragDiv className="top-bar">
                    <WindowOperation height={40} hide={false}/>
                </CustomDragDiv>
                <div style={{width: 300}}>
                    <Viewer
                        noClose={true}
                        noNavbar={true}
                        showTotal={false}
                        noImgDetails={true}
                        visible={true}
                        images={[{src: url, alt: ''}]}
                        customToolbar={toolbars => {
                            return toolbars.concat([
                                {
                                    key: "download-img",
                                    render: (
                                        <div>
                                            <i className="react-viewer-icon react-viewer-icon-download"></i>
                                        </div>
                                    ),
                                    onClick: activeImage => {
                                        saveDialog()
                                    }
                                }
                            ]);
                        }}
                    />
                </div>
            </div>
        </div>
    )
}