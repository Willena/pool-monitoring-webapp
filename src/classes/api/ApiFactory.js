import manuaAPI from "@/classes/api/manuaAPI";
import rebootAPI from "@/classes/api/rebootAPI";
import statusAPI from "@/classes/api/statusAPI";
import updateAPI from "@/classes/api/updateAPI";

export const ApiFactory = {
    update: updateAPI,
    status: statusAPI,
    reboot : rebootAPI,
    manual : manuaAPI
    // other repositories ...
};
