import Http from "../utils/api";

export default {
    friendApply(param) {
        return Http.post(`/v1/api/notify/friend/apply`, param)
    },
    friendList() {
        return Http.get(`/v1/api/notify/friend/list`)
    },
    read(param) {
        return Http.post(`/v1/api/notify/read`, param)
    },
    systemList() {
        return Http.get(`/v1/api/notify/system/list`)
    }
};
