import axios from "axios"
import { errors, success } from "../enums/messages"
import { useState } from "react";
import { Kapan } from "./api.kapan";
import {Main} from "./Main"
import { PRE_PROCESS_TYPES, PROCESS_IDS } from "../enums/processes";

export class Cart extends Main{

    //Packets
    static getPackets = async (kapanId,id,process,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getPackets?id=${id}&kapanId=${kapanId}&process=${process}`
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

    static getPacket = async (kapanId,cutId,process,id,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getPacket?id=${id}&kapanId=${kapanId}&cutId=${cutId}&process=${process}`
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

    static addPacket = async (kapanId,id,process,body,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}addPacket?id=${id}&kapanId=${kapanId}&process=${process}`
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

    static deletePacket = async (kapanId,cutId,process,id,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}deletePacket?cutId=${cutId}&kapanId=${kapanId}&process=${process}&id=${id}`
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

    static editPacket = async (kapanId,cutId,process,id,data,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}updatePacket?cutId=${cutId}&kapanId=${kapanId}&process=${process}&id=${id}`
        try {
            const res = await axios.post(api,data);
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

    static editPacketField = async (kapanId,cutId,process,id,field,data,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}updatePacketField?cutId=${cutId}&kapanId=${kapanId}&process=${process}&id=${id}&field=${field}`
        try {
            const res = await axios.post(api,data);
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

    //SubPackets
    static getSPackets = async (kapanId,cutId,process,id,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getSPackets?cutId=${cutId}&kapanId=${kapanId}&process=${process}&id=${id}`
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

    static getSPacket = async (kapanId,cutId,process,packetId,id,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getSPacket?id=${id}&kapanId=${kapanId}&cutId=${cutId}&process=${process}&packetId=${packetId}`
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

    static addSPacket = async (kapanId,cutID,process,id,body,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}addSPacket?id=${id}&kapanId=${kapanId}&cutId=${cutID}&process=${process}`
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

    static deleteSPacket = async (kapanId,cutId,process,packetId,id,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}deleteSPacket?cutId=${cutId}&kapanId=${kapanId}&process=${process}&id=${id}&packetId=${packetId}`
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

    static editSPacket = async (kapanId,cutId,process,packetId,id,data,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}updateSPacket?cutId=${cutId}&kapanId=${kapanId}&process=${process}&id=${id}&packetId=${packetId}`
        try {
            const res = await axios.post(api,data);
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

    static editSPacketField = async (kapanId,cutId,process,packetId,id,field,data,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}updateSPacketField?cutId=${cutId}&kapanId=${kapanId}&process=${process}&id=${id}&packetId=${packetId}&field=${field}`
        try {
            const res = await axios.post(api,data);
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
    
    //Carts
    static getCarts = async(kapanId,cutId,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getCarts?kapanId=${kapanId}&id=${cutId}`
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
    static weightTransfer = async (kapanId,id,body,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}weightTransfer?cutId=${id}&kapanId=${kapanId}`
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
    static returnMainPacket = async (kapanId,cutId,process,id,body,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}ReturnMainPacket?cutId=${cutId}&kapanId=${kapanId}&process=${process}&id=${id}`
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

}
