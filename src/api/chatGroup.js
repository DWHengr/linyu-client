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
    },
    uploadPortrait(file, param) {
        return Http.upload(`/v1/api/chat-group/upload/portrait`, file, param)
    },
    updateGroupName(param) {
        return Http.post("/v1/api/chat-group/update/name", param);
    },
    update(param) {
        return Http.post("/v1/api/chat-group/update", param);
    },
    invite(param) {
        return Http.post("/v1/api/chat-group/invite", param);
    },
    quit(param) {
        return Http.post("/v1/api/chat-group/quit", param);
    },
    kick(param) {
        return Http.post("/v1/api/chat-group/kick", param);
    },
    dissolve(param) {
        return Http.post("/v1/api/chat-group/dissolve", param);
    },
    transfer(param) {
        return Http.post("/v1/api/chat-group/transfer", param);
    }
};
