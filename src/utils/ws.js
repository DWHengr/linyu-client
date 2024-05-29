import WebSocket from '@tauri-apps/plugin-websocket';
import {emit} from "@tauri-apps/api/event";

let ws = null
let heartTimer = null
let timer = null
let lockReconnect = false
let token = null
const reconnectCountMax = 100
let reconnectCount = 0
let isConnect = false

function response(msg) {
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
            }
        }
    } else {
        onCloseHandler()
    }
}

function connect(tokenStr) {
    if (isConnect || ws) return
    isConnect = true
    token = tokenStr
    try {
        WebSocket.connect("ws://127.0.0.1:9100/ws?x-token=" + token).then((r) => {
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
    }, 2000)
}


const clearHeartPackTimer = () => {
    console.log("销毁clearHeartPackTimer")
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


export default {connect};