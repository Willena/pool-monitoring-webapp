import ApiBase from "./ApiBase";

const resource = "/api/reboot";
export default {
    reboot() {
        return ApiBase.post(`${resource}`);
    },
};
