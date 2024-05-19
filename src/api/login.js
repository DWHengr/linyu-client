import Http from "../utils/api";

export default {
    login(param) {
        return Http.post("/v1/api/login", param);
    },
};
