import Http from "../utils/api";

export default {
    list(param) {
        return Http.post("/v1/api/chat-group-notice/list", param);
    },
    create(param) {
        return Http.post("/v1/api/chat-group-notice/create", param);
    },
    delete(param) {
        return Http.post("/v1/api/chat-group-notice/delete", param);
    },
    update(param) {
        return Http.post("/v1/api/chat-group-notice/update", param);
    },
};
