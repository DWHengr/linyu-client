import CustomModal from "../CustomModal/index.jsx";
import IconButton from "../IconButton/index.jsx";
import CustomButton from "../CustomButton/index.jsx";
import {useEffect, useState} from "react";

export default function CustomAffirmModal({isOpen, txt, onOk, onCancel}) {

    const [interIsOpen, setInterIsOpen] = useState(isOpen)

    useEffect(() => {
        setInterIsOpen(isOpen)
    }, [isOpen])

    return (
        <CustomModal isOpen={interIsOpen}>
            <div style={{width: 380, height: 140, backgroundColor: "white", borderRadius: 10, position: "relative"}}>
                <div style={{
                    display: "flex",
                    position: "relative",
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: 30,
                    top: 5,
                }}>
                    <div style={{position: "absolute", right: 10}}>
                        <IconButton
                            danger
                            icon={<i className={`iconfont icon-guanbi`} style={{fontSize: 20}}/>}
                            onClick={() => {
                                if (onCancel) onCancel()
                            }}
                        />
                    </div>
                </div>
                <div style={{width: "100%", padding: "10px 20px"}}>
                    {txt}
                </div>
                <div style={{display: "flex", position: "absolute", right: 10, bottom: 10}}>
                    <CustomButton
                        width={55}
                        onClick={() => {
                            if (onOk) onOk()
                        }}
                    >
                        确定
                    </CustomButton>
                    <CustomButton
                        width={55}
                        type="minor"
                        onClick={() => {
                            if (onCancel) onCancel()
                        }}
                    >
                        取消
                    </CustomButton>
                </div>
            </div>
        </CustomModal>
    )
}