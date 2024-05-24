import Http from "../utils/api";

export default {
    sendMsg(param) {
        return Http.post("/v1/api/message/send/to/user", param);
    },
    record(param) {
        return Http.post("/v1/api/message/record", param);
    },
};
