import Http from "../utils/api";

export default {
    list() {
        return Http.get("/v1/api/friend/list");
    },
    details(param) {
        return Http.get(`/v1/api/friend/details/${param}`)
    },
    search(param) {
        return Http.post(`/v1/api/friend/search`, param)
    },
    agree(param) {
        return Http.post(`/v1/api/friend/agree`, param)
    },
    setRemark(param) {
        return Http.post(`/v1/api/friend/set/remark`, param)
    },
    setGroup(param) {
        return Http.post(`/v1/api/friend/set/group`, param)
    },
    delete(param) {
        return Http.post(`/v1/api/friend/delete`, param)
    },
    careFor(param) {
        return Http.post(`/v1/api/friend/carefor`, param)
    },
    unCareFor(param) {
        return Http.post(`/v1/api/friend/uncarefor`, param)
    },
    listFlat(param) {
        return Http.get("/v1/api/friend/list/flat", param);
    },
    listFlatUnread(param) {
        return Http.get("/v1/api/friend/list/flat/unread", param);
    },
};
