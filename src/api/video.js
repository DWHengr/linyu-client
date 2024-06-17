import Http from "../utils/api";

export default {
    offer(param) {
        return Http.post(`/v1/api/video/offer`, param)
    },
    answer(param) {
        return Http.post(`/v1/api/video/answer`, param)
    },
    candidate(param) {
        return Http.post(`/v1/api/video/candidate`, param)
    },
    hangup(param) {
        return Http.post(`/v1/api/video/hangup`, param)
    },
    invite(param) {
        return Http.post(`/v1/api/video/invite`, param)
    },
    accept(param) {
        return Http.post(`/v1/api/video/accept`, param)
    }
};
