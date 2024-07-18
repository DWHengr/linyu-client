import Http from "../utils/api";

export default {
    sendMsg(param) {
        return Http.post("/v1/api/message/send/to/user", param);
    },
    record(param) {
        return Http.post("/v1/api/message/record", param);
    },
    sendFile(param, progressHandler) {
        return Http.uploadFile("/v1/api/message/send/file", param, progressHandler)
    },
    getFile(param, progressHandler) {
        return Http.downloadFile("/v1/api/message/get/file", param, progressHandler)
    },
    getMedia(param) {
        return Http.get("/v1/api/message/get/media", param)
    },
    sendMedia(file, param, progressHandler) {
        return Http.upload("/v1/api/message/send/file", file, param)
    },
    retraction(param) {
        return Http.post("/v1/api/message/retraction", param);
    },
    reedit(param) {
        return Http.post("/v1/api/message/reedit", param);
    }
};
