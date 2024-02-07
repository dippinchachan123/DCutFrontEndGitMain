import axios from "axios";
import {
    errors,
    success
} from "../enums/messages";
import {
    Main
} from "./Main";
import { useNavigate } from "react-router-dom";
import { Cut } from "./api.cut";


export class Kapan extends Main {
    static getKapans = async (postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getKapans`
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

    static getKapanByID = async (id,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getKapan?id=${id}`
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

    static addKapan = async (body,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        body.user = await Main.getCurrentUser();

        const api = `${Main.DomainName}/api/${postProcess?"PP":""}addKapan`
        try {
            const res = await axios.post(api, body)
            const res_1 = res.data
            if(!res_1.err && postProcess){
                await Cut.addCut(res_1.data.id,{
                    id : 1,
                    weight : body.weight,
                    pieces : 1,
                    status : "PENDING",
                    size : body.weight,
                    remarks : "Added Automatically at id 1"
                },true)
            }
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

    static editKapanByID = async (id, body,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        body.user = await Main.getCurrentUser();

        const api = `${Main.DomainName}/api/${postProcess?"PP":""}updateKapan?id=${id}`
        try {
            const res = await axios.post(api, body);
            const res_1 = res.data;
            if(!res_1.err && postProcess){
                await Cut.editCutByID(res_1.data[0].id,1,{
                    weight : body.weight,
                    pieces : 1,
                    status : "PENDING",
                    size : body.weight,
                    remarks : "Added Automatically at id 1"
                },true)
            }
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

    static editKapanFieldByID = async (id, field,body,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        body.user = await Main.getCurrentUser();

        const api = `${Main.DomainName}/api/${postProcess?"PP":""}updateKapanByField?id=${id}&field=${field}`
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

    static deleteKapanByID = async (id,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}deleteKapan?id=${id}`
        try {
            const res = await axios.post(api,{user : Main.getCurrentUser()});
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