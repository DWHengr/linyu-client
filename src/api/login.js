import Http from "../utils/api";

export default {
    login(param) {
        return Http.post("/v1/api/login", param);
    },
    publicKey() {
        return Http.get("/v1/api/login/public-key");
    },
};
