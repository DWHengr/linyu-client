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
    }
};
