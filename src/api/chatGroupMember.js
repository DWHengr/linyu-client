import Http from "../utils/api";

export default {
    list(param) {
        return Http.post("/v1/api/chat-group-member/list", param);
    },
};
