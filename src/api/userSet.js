import Http from "../utils/api";

export default {
    getUserSet() {
        return Http.get(`/v1/api/user-set`)
    }
};
