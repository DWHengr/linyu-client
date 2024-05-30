import Http from "../utils/api";

export default {
    list() {
        return Http.get("/v1/api/chat-list/list");
    },
    create(param) {
        return Http.post("/v1/api/chat-list/create", param);
    },
    read(param) {
        return Http.get(`/v1/api/chat-list/read/${param}`)
    },
    detail(param) {
        return Http.get(`/v1/api/chat-list/detail/${param}`)
    },
    delete(param) {
        return Http.post("/v1/api/chat-list/delete", param);
    },
    top(param) {
        return Http.post("/v1/api/chat-list/top", param);
    }
};
