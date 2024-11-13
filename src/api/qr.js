import Http from "../utils/api";

export default {
    code(param) {
        return Http.get(`/qr/code`, param)
    },
    result(param) {
        return Http.post(`/qr/code/result`, param)
    },
};
