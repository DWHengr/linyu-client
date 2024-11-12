import Http from "../utils/api";

export default {
    code() {
        return Http.get(`/qr/code`)
    },
    result(param) {
        return Http.post(`/qr/code/result`, param)
    },
};
