import {invoke} from "@tauri-apps/api/core";

export async function setItem(key, value) {
    let userinfo = await invoke("get_user_info", {})
    let userKey = "user" + userinfo.user_id
    let data = JSON.parse(localStorage.getItem(userKey))
    localStorage.setItem(userKey, JSON.stringify({...data, [key]: value}))
}

export async function getItem(key) {
    let userinfo = await invoke("get_user_info", {})
    let userKey = "user" + userinfo.user_id
    let data = JSON.parse(localStorage.getItem(userKey))
    return data[key]
}

export function getLocalItem(key) {
    return JSON.parse(localStorage.getItem(key))
}

export function setLocalItem(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}