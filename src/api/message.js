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
    getImg(param) {
        return Http.get("/v1/api/message/get/img", param)
    }
};
