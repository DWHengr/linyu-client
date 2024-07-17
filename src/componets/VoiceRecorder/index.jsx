import "./index.less"
import React, {useState, useRef, useEffect} from 'react';
import CustomButton from "../CustomButton/index.jsx";
import CustomModal from "../CustomModal/index.jsx";
import CustomAudio from "../CustomAudio/index.jsx";

const VoiceRecorder = ({onComplete}) => {
    const [audioUrl, setAudioUrl] = useState(null);
    const [recording, setRecording] = useState(false);
    const [recordingTime, setRecordingTime] = useState(0);
    const mediaRecorderRef = useRef(null);
    const audioChunksRef = useRef([]);
    const audioContextRef = useRef(null);
    const analyserRef = useRef(null);
    const dataArrayRef = useRef(null);
    const animationIdRef = useRef(null);
    const intervalIdRef = useRef(null);
    const canvasRef = useRef(null);
    const [isVoiceOpen, setIsVoiceOpen] = useState(false);
    const audioRef = useRef(null);
    const audioBlobRef = useRef(null)
    const isCompleterRef = useRef(false)

    useEffect(() => {
        if (audioBlobRef.current && isCompleterRef.current) {
            if (onComplete) {
                onComplete(audioBlobRef.current, recordingTime)
                setIsVoiceOpen(false)
            }
        }
    }, [audioBlobRef.current])

    const startRecording = async () => {
        audioBlobRef.current = null
        setRecording(true);
        setRecordingTime(0);
        audioChunksRef.current = [];
        const stream = await navigator.mediaDevices.getUserMedia({audio: true});
        mediaRecorderRef.current = new MediaRecorder(stream);

        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        analyserRef.current = audioContextRef.current.createAnalyser();
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        const bufferLength = analyserRef.current.frequencyBinCount;
        dataArrayRef.current = new Uint8Array(bufferLength);

        mediaRecorderRef.current.ondataavailable = event => {
            audioChunksRef.current.push(event.data);
        };

        mediaRecorderRef.current.onstop = async () => {
            const audioBlob = new Blob(audioChunksRef.current, {type: 'audio/wav'});
            const audioUrl = URL.createObjectURL(audioBlob);
            setAudioUrl(audioUrl);
            audioBlobRef.current = audioBlob
            cancelAnimationFrame(animationIdRef.current);
            clearInterval(intervalIdRef.current);
        };

        mediaRecorderRef.current.start();
        startVolumeMeter();
        startRecordingTimer();
    };

    const stopRecording = () => {
        clearInterval(intervalIdRef.current);
        setRecording(false);
        mediaRecorderRef.current.stop();
    };

    const startVolumeMeter = () => {
        const canvas = canvasRef.current;
        const canvasCtx = canvas.getContext('2d');

        const draw = () => {
            analyserRef.current.getByteFrequencyData(dataArrayRef.current);
            const width = canvas.width;
            const height = canvas.height;
            canvasCtx.clearRect(0, 0, width, height);

            const barWidth = (width / dataArrayRef.current.length) * 2.5;
            let barHeight;
            let x = 0;

            for (let i = 0; i < dataArrayRef.current.length; i++) {
                barHeight = dataArrayRef.current[i] / 2;

                canvasCtx.fillStyle = `rgb(${barHeight + 76}, 155, 255)`;
                canvasCtx.fillRect(x, height - barHeight / 2, barWidth, barHeight);

                x += barWidth + 1;
            }

            animationIdRef.current = requestAnimationFrame(draw);
        };

        draw();
    };

    const startRecordingTimer = () => {
        if (intervalIdRef.current) clearInterval(intervalIdRef.current)
        intervalIdRef.current = setInterval(() => {
            setRecordingTime(prevTime => {
                if (prevTime >= 59) {
                    stopRecording();
                    return 60;
                }
                return prevTime + 1;
            });
        }, 1000);
    };

    const handlerClose = () => {
        stopRecording()
        setIsVoiceOpen(false)
    }

    const handlerStart = () => {
        audioBlobRef.current = null
        isCompleterRef.current = false
        setIsVoiceOpen(true)
        startRecording()
    }

    const handlerComplete = () => {
        isCompleterRef.current = true
        if (!audioBlobRef.current) {
            stopRecording()
        } else {
            if (onComplete) {
                onComplete(audioBlobRef.current, recordingTime)
                setIsVoiceOpen(false)
            }
        }
    }

    return (
        <div className="voice-recorder-container">
            <CustomModal isOpen={isVoiceOpen} overlayColor="rgba(0,0,0,0.3)">
                <div className="voice-recorder">
                    {recording && (
                        <div>
                            <div style={{color: "#1f1f1f"}}>时长: {recordingTime}秒</div>
                            <canvas ref={canvasRef} width="300" height="100"></canvas>
                        </div>
                    )}
                    {!recording && audioUrl && (
                        <CustomAudio audioUrl={audioUrl} time={recordingTime}/>
                    )}
                    <div className="voice-operate">
                        <div className="operate-item" onClick={startRecording} style={{color: "#939393"}}>
                            <i className={`iconfont icon icon-zhongxin`} style={{fontSize: 30}}/>
                        </div>
                        <div className="operate-item" onClick={stopRecording} style={{color: "#939393"}}>
                            <i className={`iconfont icon icon-tingzhi`} style={{fontSize: 30}}/>
                        </div>
                        <div className="operate-item" onClick={handlerClose} style={{color: "#ff4c4c"}}>
                            <i className={`iconfont icon icon-quxiao`} style={{fontSize: 30}}/>
                        </div>
                        <div className="operate-item" onClick={handlerComplete} style={{color: "#4C9BFF"}}>
                            <i className={`iconfont icon icon-wancheng2`} style={{fontSize: 30}}/>
                        </div>
                    </div>
                </div>
            </CustomModal>
            <div>
                <CustomButton width={10} onClick={handlerStart}>
                    <i className={`iconfont icon icon-yuyin`} style={{fontSize: 14}}/>
                </CustomButton>
            </div>
        </div>
    );
};

export default VoiceRecorder;
