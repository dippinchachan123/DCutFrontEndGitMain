import axios from "axios";
import { errors, success } from "../enums/messages";
import { config } from "../config";

export class Main {
    static DomainName = config.BACKEND_DOMAIN

    static authenticate(){
        if(!Main.getCurrentUser()){
            window.location.href = '/login'
            return true
        }
        return false
    }
    static getCurrentUser() {
        return JSON.parse(localStorage.getItem('user'));
    }

    static isAdmin(user){
        user = user || this.getCurrentUser()

        return user?user.role == "Admin":Main.getCurrentUser() && Main.getCurrentUser().role == "Admin"
    }

    static isStaff(user){
        user = user || this.getCurrentUser()

        return user?user.role == "Staff":Main.getCurrentUser() && Main.getCurrentUser().role == "Staff"

    }

    static isSuperAdmin(user){
        return user?user.role == "Super-Admin":Main.getCurrentUser() && Main.getCurrentUser().role == "Super-Admin"

    }

    static isPreProcess(user){
        user = user || this.getCurrentUser()
        console.log(user)

        if(user.role == "Staff"){
            return user.staff.type == "Pre-Process"
        }
        return false
    }
    static isPostProcess(user){
        user = user || this.getCurrentUser()
        console.log(user)

        if(user.role == "Staff"){
            return user.staff.type == "Post-Process"
        }
        
        return false
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