import axios from "axios";
import { errors, success } from "../enums/messages";
import { config } from "../config";

export class Main {
    static DomainName = config.BACKEND_DOMAIN
    static async authenticate(){
        if(!await Main.getCurrentUser()){
            window.location.href = '/'
            return true
        }
        return false
    }
    static async getCurrentUser() {
        const usr = localStorage.getItem('user')
        if(!usr){
            return false
        }
        return await JSON.parse(localStorage.getItem('user'));
    }

    static isAdmin(user){
        if(!user){
            return new Promise((resolve,reject)=>{
                Main.getCurrentUser().
                then(usr => {
                    resolve(usr.role == "Admin")
                })
                .catch(err => {
                    reject(err)
                })
            })
        }
        return user && user.role == "Admin"
    }

    static isStaff(user){
        if(!user){
            return new Promise((resolve,reject)=>{
                Main.getCurrentUser().
                then(usr => {
                    resolve(usr.role == "Staff")
                })
                .catch(err => {
                    reject(err)
                })
            })
        }
        return user && user.role == "Staff"
    }

    static isSuperAdmin(user){
        if(!user){
            return new Promise((resolve,reject)=>{
                Main.getCurrentUser().
                then(usr => {
                    resolve(usr.role == "Super-Admin")
                })
                .catch(err => {
                    reject(err)
                })
            })
        }
        return user && user.role == "Super-Admin"
    }

    static isPreProcess(user){
        if(!user){
            return new Promise((resolve,reject)=>{
                Main.getCurrentUser().
                then(usr => {
                    resolve(usr.role == "Staff" && usr.staff.type == "Pre-Process")
                })
                .catch(err => {
                    reject(err)
                })
            })
        }
        return user.role == "Staff" && user.staff.type == "Pre-Process"
    }
    static  isPostProcess(user){
        if(!user){
            return new Promise((resolve,reject)=>{
                Main.getCurrentUser().
                then(usr => {
                    resolve(usr.role == "Staff" && usr.staff.type == "Post-Process")
                })
                .catch(err => {
                    reject(err)
                })
            })
        }
        return user.role == "Staff" && user.staff.type == "Post-Process"
    }

    static lockForStaff(user,lock){
        return this.isStaff(user) && lock.status
    }

    static extractPath(data, path) {
        
        let pathChain = path.split('.');
        pathChain = pathChain.slice(1);
        let dataFinal = data;
        let id = 0;
        const _idVar = pathChain.pop();
        for (let i = 0; i < pathChain.length; i++) {
            let charPth = pathChain[i]
            if (charPth.includes("[")) {
                let index = parseInt(charPth.charAt(charPth.length - 2))
                dataFinal = dataFinal[charPth.slice(0, - 3)][index]
            } else {
                dataFinal = dataFinal[charPth]
            }
        }
        if(dataFinal.length < 1 || !data){
            return 1
        }
        dataFinal.forEach(element => {
            if(element[_idVar] > id){
                id = element[_idVar]
            }
        });
        return id + 1;
    }

    static async uploadImage(body){
        const api = `${Main.DomainName}/upload`
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

    static getImageURL(id){
        return `${Main.DomainName}/image?id=${id}`
    }
}