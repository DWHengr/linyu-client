import Http from "../utils/api";

export default {
    list() {
        return Http.get("/v1/api/chat-group/list");
    },
    details(param) {
        return Http.post("/v1/api/chat-group/details", param);
    },
    create(param) {
        return Http.post("/v1/api/chat-group/create", param);
    }
};
