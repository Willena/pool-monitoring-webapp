import ApiBase from "./ApiBase";

const resource = "/api/manual";
export default {

    resetManualState() {
        return ApiBase.delete(`${resource}`);
    },

    setManualState(duration, on) {
        return ApiBase.put(`${resource}`, {
            duration: duration,
            on : on
        });
    },
    setManualStateInfinite(on){
        return ApiBase.put(`${resource}`, {on:on});
    }
};
