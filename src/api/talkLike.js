import Http from "../utils/api";

export default {
    list(param) {
        return Http.post(`/v1/api/talk-like/list`, param)
    },
    create(param) {
        return Http.post(`/v1/api/talk-like/create`, param)
    },
    delete(param) {
        return Http.post(`/v1/api/talk-like/delete`, param)
    }
};
