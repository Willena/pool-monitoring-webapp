import ApiBase from "./ApiBase";

const resource = "/api/status";
export default {

    get() {
        return ApiBase.delete(`${resource}`);
    },


};
