import axios from "axios";
import {
    errors,
    success
} from "../enums/messages";
import {
    Main
} from "./Main";

export class Staff extends Main {
    static getStaffs = (type) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/getStaffs?type=${type}`
        return axios.get(api)
            .then(res => res.data)
            .then(res => {
                return res.err ? {
                    err: true,
                    data: res.data,
                    msg: errors.FETCHING_ERROR
                } : {
                    err: false,
                    data: res.data,
                    msg: success.FETCHING_SUCCESS
                }
            })
            .catch(err => {
                return {
                    err: true,
                    data: err,
                    msg: errors.FETCHING_ERROR
                }
            })
    }

    static getStaffByID = async (id,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}getStaff?id=${id}`
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

    static addStaff = async (body,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}addStaff`
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

    static editStaffByID = (id, body,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}updateStaff?id=${id}`
        return axios.post(api, body)
            .then(res => res.data)
            .then(res => {
                return res.err || res.notFound ? {
                    err: true,
                    data: res.data,
                    msg: !res.notFound ? errors.UPDATE_ERROR : errors.NOTFOUND
                } : {
                    err: false,
                    data: res.data,
                    msg: success.UPDATE_SUCCESS
                }
            })
            .catch(err => {
                return {
                    err: true,
                    data: err,
                    msg: errors.UPDATE_ERROR
                }
            })
    }

    static deleteStaffByID = (id,postProcess = false) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/${postProcess?"PP":""}deleteStaff?id=${id}`
        return axios.post(api)
            .then(res => res.data)
            .then(res => {
                return res.err || res.notFound ? {
                    err: true,
                    data: res.data,
                    msg: !res.notFound ? errors.DELETION_ERROR : errors.NOTFOUND
                } : {
                    err: false,
                    data: res.data,
                    msg: success.DELETION_SUCCESS
                }
            })
            .catch(err => {
                return {
                    err: true,
                    data: err,
                    msg: errors.DELETION_ERROR
                }
            })
    }
}