import Http from "../utils/api";

export default {
    create(param) {
        return Http.post("/v1/api/group/create", param);
    },
    update(param) {
        return Http.post("/v1/api/group/update", param);
    },
    delete(param) {
        return Http.post("/v1/api/group/delete", param);
    }
};