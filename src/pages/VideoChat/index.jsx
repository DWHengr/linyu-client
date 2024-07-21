import {useEffect, useRef, useState} from "react";
import "./index.less"
import VideoApi from "../../api/video.js";
import {listen} from "@tauri-apps/api/event";
import {WebviewWindow} from "@tauri-apps/api/WebviewWindow";
import WindowOperation from "../../componets/WindowOperation/index.jsx";
import CustomDragDiv from "../../componets/CustomDragDiv/index.jsx";
import ChatListApi from "../../api/chatList.js";
import {useToast} from "../../componets/CustomToast/index.jsx";
import {getItem} from "../../utils/storage.js";
import {formatTimingTime} from "../../utils/date.js";

export default function VideoChat() {
    const toUserId = useRef()
    const local = useRef()
    const remote = useRef()
    const [isSwitch, setIsSwitch] = useState(false)
    let webcamStream = useRef()
    let pc = useRef()
    const [toUserIsReady, setToUserIsReady] = useState(false)
    const [userInfo, setUserInfo] = useState(null)
    const [isSender, setIsSender] = useState(false)
    const [isAudioEnabled, setIsAudioEnabled] = useState(true)
    const [isVideoEnabled, setIsVideoEnabled] = useState(true)
    const isOnlyAudioRef = useRef(false)
    const [isOnlyAudio, setIsOnlyAudio] = useState(false)
    const [time, setTime] = useState(0)
    const timerId = useRef(null)
    const showToast = useToast();


    useEffect(() => {
        let label = WebviewWindow.getCurrent().label
        let param = label.split('-')
        getItem("video-chat").then(value => {
            toUserId.current = value.userId
            setIsSender(value.isSender)
            isOnlyAudioRef.current = value.isOnlyAudio
            setIsOnlyAudio(value.isOnlyAudio)
            ChatListApi.detail(toUserId.current).then(res => {
                if (res.code === 0) {
                    setUserInfo(res.data)
                }
            })
            initRTCPeerConnection()
            videoCall()
        })
        return () => {
            handlerDestroyTime()
        };
    }, [])

    const handlerDestroyTime = () => {
        if (timerId.current)
            clearInterval(timerId.current)
    }

    useEffect(() => {
        const unVideoMsgListen = listen('on-receive-video', async (event) => {
            let msg = event.payload;
            switch (msg.type) {
                case "offer": {
                    handleVideoOfferMsg(msg)
                    break
                }
                case "answer": {
                    handleVideoAnswerMsg(msg)
                    break
                }
                case "candidate": {
                    handleNewICECandidateMsg(msg)
                    break
                }
                case "hangup": {
                    handlerDestroyTime()
                    showToast("对方已挂断~", true)
                    setTimeout(function () {
                        WebviewWindow.getCurrent().close()
                    }, 2000);
                    break
                }
                case "accept": {
                    onOffer()
                    break
                }
            }
        })
        return async () => {
            (await unVideoMsgListen)();
        }
    }, [])

    const handleICECandidateEvent = (event) => {
        if (event.candidate) {
            VideoApi.candidate({userId: toUserId.current, candidate: event.candidate})
        }
    }

    const handleTrackEvent = (event) => {
        remote.current.srcObject = event.streams[0];
    }

    const handleVideoOfferMsg = async (data) => {
        const desc = new RTCSessionDescription(data.desc);
        await pc.current.setRemoteDescription(desc);
        await pc.current.setLocalDescription(await pc.current.createAnswer());
        await VideoApi.answer({userId: toUserId.current, desc: pc.current.localDescription})
    };

    const handleVideoAnswerMsg = async (data) => {
        const desc = new RTCSessionDescription(data.desc);
        await pc.current.setRemoteDescription(desc).catch(reportError);
    };

    const handleNewICECandidateMsg = async (data) => {
        const candidate = new RTCIceCandidate(data.candidate);
        try {
            await pc.current.addIceCandidate(candidate);
        } catch (err) {
            console.log(err)
        }
    };

    const videoCall = async () => {
        try {
            webcamStream.current = await navigator.mediaDevices.getUserMedia({
                video: !isOnlyAudioRef.current, audio: true,
            });
            local.current.srcObject = webcamStream.current;
            local.current.muted = true;
            webcamStream.current.getTracks().forEach((track) => pc.current.addTrack(track, webcamStream.current));
        } catch (e) {
            showToast("相机/麦克风权限未允许~", true)
        }
    }

    const onOffer = async () => {
        const offer = await pc.current.createOffer();
        await pc.current.setLocalDescription(offer);
        await VideoApi.offer({userId: toUserId.current, desc: pc.current.localDescription})
    }

    const onHangup = () => {
        handlerDestroyTime()
        VideoApi.hangup({userId: toUserId.current}).then(res => {
            WebviewWindow.getCurrent().close()
        })
    }

    const onAccept = () => {
        VideoApi.accept({userId: toUserId.current}).then(res => {
            setToUserIsReady(true)
        })
    }

    const handleICEConnectionStateChangeEvent = (event) => {
        setToUserIsReady(true)
        handlerDestroyTime()
        timerId.current = setInterval(() => {
            setTime(prevTime => prevTime + 1);
        }, 1000);
    }

    const initRTCPeerConnection = () => {
        const iceServer = {
            iceServers: [{
                url: "stun:stun.l.google.com:19302",
            }, {
                url: "turn:numb.viagenie.ca", username: "webrtc@live.com", credential: "muazkh",
            },],
        };
        pc.current = new RTCPeerConnection(iceServer);
        pc.current.onicecandidate = handleICECandidateEvent;
        pc.current.oniceconnectionstatechange = handleICEConnectionStateChangeEvent;
        pc.current.onicecandidate = handleICECandidateEvent;
        pc.current.ontrack = handleTrackEvent;
    };

    const toggleAudio = () => {
        setIsAudioEnabled((prev) => {
            webcamStream.current.getAudioTracks().forEach((track) => {
                track.enabled = !prev;
            });
            return !prev;
        });
    };

    const toggleVideo = () => {
        setIsVideoEnabled((prev) => {
            webcamStream.current.getVideoTracks().forEach((track) => {
                track.enabled = !prev;
            });
            return !prev;
        });
    };


    return (<div className="video-chat-container ">
        <CustomDragDiv className="video-chat">
            <div className="video-container">
                <WindowOperation
                    hide={false}
                    onClose={onHangup}
                />
                <div className="video">
                    <CustomDragDiv
                        className="info-bar"
                    >
                        {userInfo?.remark ? userInfo?.remark : userInfo?.name}
                    </CustomDragDiv>
                    <video
                        onClick={() => {
                            if (!isSwitch && toUserIsReady) {
                                setIsSwitch(!isSwitch)
                            }
                        }}
                        className={`${isSwitch ? "max-window" : "min-window"}`}
                        style={{display: isOnlyAudio ? "none" : ""}}
                        ref={local} autoPlay
                    />
                    <video
                        onClick={() => {
                            if (isSwitch && toUserIsReady) {
                                setIsSwitch(!isSwitch)
                            }
                        }}
                        className={`${isSwitch ? "min-window" : "max-window"}`}
                        ref={remote} autoPlay
                        style={{display: !toUserIsReady || isOnlyAudio ? "none" : ""}}
                    />
                    {(!toUserIsReady || isOnlyAudio) && <div
                        style={{
                            width: "100%",
                            height: "100%",
                            backgroundImage: `url(${userInfo?.portrait})`,
                            backgroundSize: 'cover',
                        }}
                    >
                        <div
                            style={{
                                display: "flex",
                                flexDirection: "column",
                                width: "100%",
                                height: "100%",
                                justifyContent: "center",
                                alignItems: "center",
                                backdropFilter: "blur(20px)"
                            }}
                        >
                            <img style={{width: 100, borderRadius: 10}} src={userInfo?.portrait}/>
                            {toUserIsReady ? <div className="dots">正在语音通话中</div> :
                                (isSender ?
                                    <div className="dots">正在等待对方接听</div> :
                                    <div className="dots">对方请求视频通话</div>)
                            }
                        </div>
                    </div>}
                    <CustomDragDiv
                        className="operate-bar"
                    >
                        <div style={{
                            backgroundColor: "rgba(182, 182, 182, 0.4)",
                            width: 100,
                            borderRadius: 10,
                            textAlign: "center"
                        }}>{formatTimingTime(time)}</div>
                        <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
                            <div
                                className="operate"
                                onClick={toggleAudio}
                            >
                                <i
                                    className={`iconfont icon ${isAudioEnabled ? "icon-yuyin" : "icon-yuyin-ban"}`}
                                    style={{fontSize: 20}}
                                />
                            </div>
                            <div
                                className="operate hangup"
                                onClick={onHangup}
                            >
                                <i className={`iconfont icon icon-guaduan`} style={{fontSize: 28}}/>
                            </div>
                            {
                                (!isSender && !toUserIsReady) && <div
                                    className="operate accept"
                                    onClick={onAccept}
                                >
                                    <i className={`iconfont icon icon-shipin2`} style={{fontSize: 28}}/>
                                </div>
                            }
                            {!isOnlyAudio && <div
                                className="operate"
                                onClick={toggleVideo}
                            >
                                <i
                                    className={`iconfont icon ${isVideoEnabled ? "icon-shipin" : "icon-shipin-ban"}`}
                                    style={{fontSize: 24}}
                                />
                            </div>
                            }
                        </div>
                    </CustomDragDiv>
                </div>
            </div>
        </CustomDragDiv>
    </div>)
}