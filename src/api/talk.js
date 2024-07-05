import Http from "../utils/api";

export default {
    list(param) {
        return Http.post(`/v1/api/talk/list`, param)
    },
    create(param) {
        return Http.post(`/v1/api/talk/create`, param)
    },
    uploadImg(file, param) {
        return Http.upload(`/v1/api/talk/upload/img`, file, param)
    },
    delete(param) {
        return Http.post(`/v1/api/talk/delete`, param)
    },
};
