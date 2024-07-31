import "./index.less"
import CustomSoundIcon from "../CustomSoundIcon/index.jsx";
import React, {useRef, useState} from "react";

export default function CustomAudio({audioUrl, time, onLoadedMetadata, type = ""}) {
    const [audioTime, setAudioTime] = useState(time)
    const audioRef = useRef(null)
    const [isPlay, setIsPlay] = useState(false)
    const [isPause, setIsPause] = useState(true)

    const playAudio = () => {
        if (audioRef.current && isPause) {
            audioRef.current.pause();
            setIsPlay(true)
            audioRef.current.currentTime = 0;
            audioRef.current.play();
            setIsPause(false)
        } else {
            audioRef.current.pause();
            setIsPause(true)
            setIsPlay(false)
        }
    };

    return (<div>
            <div onClick={playAudio} className={`custom-audio ${type}`}>
                <CustomSoundIcon isStart={isPlay} style={{marginLeft: 10}}
                                 barStyle={{backgroundColor: type === "" ? "#fff" : "#1f1f1f"}}/>
                <div style={{marginLeft: 10}}>{audioTime}"</div>
                <audio
                    ref={audioRef}
                    onEnded={() => {
                        setIsPlay(false)
                    }}
                    onLoadedMetadata={() => {
                        if (onLoadedMetadata) onLoadedMetadata()
                    }}
                    src={audioUrl} controls style={{display: "none"}}
                />
            </div>
        </div>)
}