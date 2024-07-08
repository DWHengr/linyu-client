import Http from "../utils/api";

export default {
    list(param) {
        return Http.post(`/v1/api/talk-comment/list`, param)
    },
    create(param) {
        return Http.post(`/v1/api/talk-comment/create`, param)
    },
    delete(param) {
        return Http.post(`/v1/api/talk-comment/delete`, param)
    }
};
