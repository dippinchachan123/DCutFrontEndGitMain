import axios from "axios";
import {
    errors,
    success
} from "../enums/messages";
import {
    Main
} from "./Main";
import { useNavigate } from "react-router-dom";


export class Kapan extends Main {
    static getKapans = async () => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/getKapans`
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

    static getKapanByID = async (id) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/getKapan?id=${id}`
        try {
            const res = await axios.get(api)
            const res_1 = res.data
            return res_1.err ? {
                err: true,
                data: res_1.data,
                msg: errors.FETCHING_ERROR
            } : {
                err: false,
                data: res_1.data,
                msg: success.FETCHING_SUCCESS
            }
        } catch (err) {
            return {
                err: true,
                data: err,
                msg: errors.FETCHING_ERROR
            }
        }
    }

    static addKapan = async (body) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/addKapan`
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

    static editKapanByID = async (id, body) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/updateKapan?id=${id}`
        try {
            const res = await axios.post(api, body);
            const res_1 = res.data;
            return res_1.err || res_1.notFound ? {
                err: true,
                data: res_1.data,
                msg: !res_1.notFound ? errors.UPDATE_ERROR : errors.NOTFOUND
            } : {
                err: false,
                data: res_1.data,
                msg: success.UPDATE_SUCCESS
            };
        } catch (err) {
            return {
                err: true,
                data: err,
                msg: errors.UPDATE_ERROR
            };
        }
    }

    static editKapanFieldByID = async (id, field,body) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/updateKapanByField?id=${id}&field=${field}`
        try {
            const res = await axios.post(api, body);
            const res_1 = res.data;
            return res_1.err || res_1.notFound ? {
                err: true,
                data: res_1.data,
                msg: !res_1.notFound ? errors.UPDATE_ERROR : errors.NOTFOUND
            } : {
                err: false,
                data: res_1.data,
                msg: success.UPDATE_SUCCESS
            };
        } catch (err) {
            return {
                err: true,
                data: err,
                msg: errors.UPDATE_ERROR
            };
        }
    }

    static deleteKapanByID = async (id) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/deleteKapan?id=${id}`
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