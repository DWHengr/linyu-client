import Http from "../utils/api";

export default {
    list() {
        return Http.get("/v1/api/chat-list/list");
    },
};
