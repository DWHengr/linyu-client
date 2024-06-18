import Http from "../utils/api";

export default {
    search(param) {
        return Http.post(`/v1/api/user/search`, param)
    },
    unread() {
        return Http.get(`/v1/api/user/unread`)
    },
    info() {
        return Http.get(`/v1/api/user/info`)
    }
};
