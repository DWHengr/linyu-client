import WebSocket from '@tauri-apps/plugin-websocket';
import {emit} from "@tauri-apps/api/event";
import {getLocalItem} from "./storage.js";

let ws = null
let heartTimer = null
let timer = null
let lockReconnect = false
let token = null
const reconnectCountMax = 200
let reconnectCount = 0
let isConnect = false

function response(msg) {
    if (typeof msg === 'string') {
        onCloseHandler()
        return
    }
    if (msg.type) {
        if (msg.data.code === -1) {
            onCloseHandler()
        } else {
            let weContent = JSON.parse(msg.data)
            switch (weContent.type) {
                case "msg": {
                    emit('on-receive-msg', weContent.content)
                    break
                }
                case "notify": {
                    emit('on-receive-notify', weContent.content)
                    break
                }
                case "video": {
                    emit('on-receive-video', weContent.content)
                    break
                }
            }
        }
    } else {
        onCloseHandler()
    }
}

function disconnect() {
    if (ws)
        ws.disconnect()
}

function connect(tokenStr) {
    if (isConnect || ws) return
    isConnect = true
    token = tokenStr
    try {
        let wsIp = getLocalItem("serverWs")
        wsIp = wsIp ? wsIp : "ws://127.0.0.1:9100"
        WebSocket.connect(wsIp + "/ws?x-token=" + token).then((r) => {
            console.log("连接服务器")
            ws = r
            ws.addListener(response);
            clearTimer()
            sendHeartPack()
        }).catch((e) => {
            onCloseHandler()
        });
    } catch (e) {
        onCloseHandler()
    }
}


function send(msg) {
    if (ws) ws.send(msg)
}

const sendHeartPack = () => {
    heartTimer = setInterval(() => {
        send("heart")
    }, 9900)
}

const onCloseHandler = () => {
    clearHeartPackTimer()
    ws = null
    isConnect = false
    if (lockReconnect) return
    lockReconnect = true
    if (timer) {
        clearTimeout(timer)
        timer = null
    }
    if (reconnectCount >= reconnectCountMax) {
        reconnectCount = 0
        return
    }
    timer = setTimeout(() => {
        connect(token)
        reconnectCount++
        lockReconnect = false
    }, 5000)
}


const clearHeartPackTimer = () => {
    console.log("关闭连接")
    if (heartTimer) {
        clearInterval(heartTimer)
        heartTimer = null
    }
}

const clearTimer = () => {
    if (timer) {
        clearInterval(timer)
        timer = null
    }
}


export default {connect, disconnect};