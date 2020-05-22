import ApiBase from "./ApiBase";

export default {

    getDefault() {
        return ApiBase.get("/config/default.txt");
    },
    getFileList() {
        return ApiBase.get("/list?dir=/config/");
    },
    setDefault(filename){
        let formData = new FormData();
        formData.append("data", new Blob([filename], { type: "application/json" }, '/config/default.txt'));

        return ApiBase.post('/edit', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    setConfig(filename, content, blob=true){
        let formData = new FormData();
        if (blob)
            formData.append("data", new Blob([content], { type: "application/json" }, '/config/'+filename));
        else
            formData.append("data", content)

        return ApiBase.post('/edit', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        })
    },
    getConfig(filename){
      return ApiBase.get("/config/"+filename)
    }
};
