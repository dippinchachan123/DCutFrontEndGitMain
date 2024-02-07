import axios from "axios"
import {
    errors,
    success
} from "../enums/messages"
import {
    useState
} from "react";
import {
    Kapan
} from "./api.kapan";
import {
    Main
} from "./Main"
import {
    PRE_PROCESS_TYPES
} from "../enums/processes";

export class Cut extends Main {

    static initCarts(data) {
        const carts = {}
        for (const key in PRE_PROCESS_TYPES) {
            if (PRE_PROCESS_TYPES.hasOwnProperty(key)) {
                const value = PRE_PROCESS_TYPES[key];
                carts[value] = {
                    pending: {
                        weight: value == PRE_PROCESS_TYPES.MARKING_LOTING ? data.weight : 0,
                    },
                    process: {
                        weight: 0,
                        pieces: 0,
                        packets: []
                    }
                }
            }
        }
        return carts;

    }

    static getCuts = async (id,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getCuts?id=${id}`
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

    static getCutByID = async (kapanId,id,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getCut?id=${id}&kapanId=${kapanId}`
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

    static addCut = async (id,body,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        body.user = await Main.getCurrentUser();

        const api = `${Main.DomainName}/api/${postProcess?"PP":""}addCut?id=${id}`
        try {
            body.carts = Cut.initCarts(body)
            console.log("Body : ",body)
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

    static editCutByID = async (kapanId,id, body,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        body.user = await Main.getCurrentUser();

        const api = `${Main.DomainName}/api/${postProcess?"PP":""}updateCut?id=${id}&kapanId=${kapanId}`
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

    static deleteCutByID = async (kapanId,id,postProcess = false) => {
        if(await Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}deleteCut?id=${id}&kapanId=${kapanId}`
        try {
            const res = await axios.post(api, {user : await Main.getCurrentUser()});
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