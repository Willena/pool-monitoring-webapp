import ApiBase from "./ApiBase";

const resource = "/api/update";
export default {

    postUpdate(fileContent, type) {
        let formData = new FormData();

        if (type === "firmware")
            formData.append("firmware", fileContent);

        if (type === "filesystem")
            formData.append("filesystem", fileContent);
        else
            return

        return ApiBase.post(`${resource}`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },

    getUpdate() {
        //return ApiBase.get(`${resource}`);

    },
};
