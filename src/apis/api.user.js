import axios from "axios";
import {
    errors,
    success
} from "../enums/messages";
import {
    Main
} from "./Main";
import { Password } from "@mui/icons-material";

export class User extends Main {
    static getUsers = async () => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/getUsers`
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

    static getUserByID = async (id) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/getUser?id=${id}`
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

    static addUser = async (body) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/addUser`
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

    static editUserByID = async (id, body) => {
        if(Main.authenticate()){
            return
        }
        const api = `${Main.DomainName}/api/updateUser?id=${id}`
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

    static deleteUserByID = async (id) => {
        if(Main.authenticate()){
            return
        }
        
        const api = `${Main.DomainName}/api/deleteUser?id=${id}`
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

    static checkUserStatus = async (number,Password) => {
        const api = `${Main.DomainName}/api/getUserStatus?number=${number}&password=${Password}`
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
                    msg: res.msg
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
}