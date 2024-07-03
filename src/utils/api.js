import {fetch} from '@tauri-apps/plugin-http';
import {invoke} from "@tauri-apps/api/core";
import {upload as tauriUpload, download as tauriDownload} from "@tauri-apps/plugin-upload";

const SERVICE_URL = "http://" + "127.0.0.1:9200";

async function send(configs) {
    let token = await invoke("get_user_info", {}).then(res => {
        return res.token
    })
    console.log(configs)
    return new Promise(async (resolve, reject) => {
        fetch(configs.url, {
            method: configs.method, body: JSON.stringify(configs.data), headers: {
                ...configs.headers, "x-token": token ? token : "", "Content-Type": "application/json",
            }
        })
            .then(async (response) => {
                if (response.ok) {
                    let result = await response.json()
                    return resolve(result);
                } else {
                    reject({
                        message: "Request failed with status code " + response.status,
                    });
                }
            })
            .catch((e) => reject({message: `网络错误: ${e}`}));
    });
}

function get(url, params = {}) {
    let urlParams = [];
    Object.keys(params).forEach((key) => {
        urlParams.push(`${key}=${encodeURIComponent(params[key])}`);
    });
    if (urlParams.length) {
        urlParams = `${SERVICE_URL + url}?${urlParams.join("&")}`;
    } else {
        urlParams = SERVICE_URL + url;
    }
    const configs = {
        url: urlParams, method: "GET", params: {
            randomTime: new Date().getTime(),
        },
    };
    return send(configs);
}

async function post(url, params = {}) {
    const configs = {
        method: "POST", url: SERVICE_URL + url, data: params,
    };
    return send(configs);
}

async function upload(url, file, params = {}) {
    if (file && file.size && file.size > 0) {
        let token = await invoke("get_user_info", {}).then(res => {
            return res.token
        })
        return new Promise(async (resolve, reject) => {
            fetch(SERVICE_URL + url, {
                method: "POST", body: file, headers: {
                    ...params,
                    "x-token": token ? token : "", "name": file.name, "type": file.type, "size": file.size,
                }
            })
                .then(async (response) => {
                    if (response.ok) {
                        let result = await response.json()
                        return resolve(result);
                    } else {
                        reject({
                            message: "Request failed with status code " + response.status,
                        });
                    }
                })
                .catch((e) => reject({message: `网络错误: ${e}`}));
        });
    }
}

async function download(url, params = {}) {
    let token = await invoke("get_user_info", {}).then(res => {
        return res.token
    })
    return new Promise(async (resolve, reject) => {
        fetch(SERVICE_URL + url, {
            method: "get",
            headers: {
                ...params,
                "x-token": token ? token : "",
            }
        })
            .then(async (response) => {
                if (response.ok) {
                    let result = await response.blob()
                    return resolve(result);
                } else {
                    reject({
                        message: "Request failed with status code " + response.status,
                    });
                }
            })
            .catch((e) => reject({message: `网络错误: ${e}`}));
    });

}

const uploadFile = async (url, params, progressHandler) => {
    let userinfo = await invoke("get_user_info", {});
    return new Promise(async (resolve, reject) => {
        tauriUpload(SERVICE_URL + url, params.path, progressHandler, {
            "msgId": params.msgId,
            "x-token": userinfo.token,
        }).then(res => {
            res = JSON.parse(res)
            return resolve(res)
        }).catch(res => {
            return reject(res)
        })
    })
}

const downloadFile = async (url, params, progressHandler) => {
    let userinfo = await invoke("get_user_info", {});
    return new Promise(async (resolve, reject) => {
        tauriDownload(SERVICE_URL + url, params.path, progressHandler,
            {
                "msgId": params.msgId,
                "x-token": userinfo.token
            }).catch(res => {
            return reject(res)
        })
    })
}

export default {post, get, upload, uploadFile, download, downloadFile, SERVICE_URL};
