import axios from "axios";
import {
    errors,
    success
} from "../enums/messages";
import {
    Main
} from "./Main";

export class Fields extends Main {
    static getFields = async (postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getFields`
        try {
            const res = await axios.get(api);
            const res_1 = res.data;
            return res_1.err ? {
                err: true,
                data: res_1.data,
                msg: errors.FETCHING_ERROR
            } : {
                err: false,
                data: res_1.data,
                msg: success.FETCHING_SUCCESS
            };
        } catch (err) {
            return {
                err: true,
                data: err,
                msg: errors.FETCHING_ERROR
            };
        }
    }


    static addField = async (key,body,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}addField?key=${key}`
        try {
            const res = await axios.post(api, body)
            const res_1 = res.data
            return res_1.err ? {
                err: true,
                data: res_1.data,
                msg: errors.SAVE_ERROR
            } : {
                err: false,
                data: res_1.data,
                msg: success.SAVE_SUCCESS
            }
        } catch (err) {
            return {
                err: true,
                data: err,
                msg: errors.SAVE_ERROR
            }
        }
    }

    static deleteFieldsByID = async (key,id,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}deleteField?id=${id}&key=${key}`
        try {
            const res = await axios.post(api);
            const res_1 = res.data;
            return res_1.err || res_1.notFound ? {
                err: true,
                data: res_1.data,
                msg: !res_1.notFound ? errors.DELETION_ERROR : errors.NOTFOUND
            } : {
                err: false,
                data: res_1.data,
                msg: success.DELETION_SUCCESS
            };
        } catch (err) {
            return {
                err: true,
                data: err,
                msg: errors.DELETION_ERROR
            };
        }
    }
}