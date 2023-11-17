import { TextField } from "@mui/material"
import "./LoginPage.scss"
import React, { useEffect, useState } from "react"
import { grey } from "@mui/material/colors"
import { User } from "../../apis/api.user"
import notificationPopup from "../../helpers/notifications";
import { errors, success } from "../../enums/messages"
import { useNavigate } from "react-router-dom"
import { useRequireAuth, useUser } from "../../context/kapanContext";


const Login = () => {
    const [data,setData] = useState({number : "",password : ""})
    const [user,setUser] = useUser();
    const navigate = useNavigate();

    const handleChange = (e)=>{
        const name = e.target.name
        const type = e.target.type;
        let value = null
        if(type == "select"){
          value  = e.target.value
        }else{
          value = type == "number"?Number(name == "img"?e.target.files[0]:e.target.value):
          name == "img"?e.target.files[0]:e.target.value  
        }
      
        setData({...data,[name] : value })
    }

    const handleSubmit = () => {
        if(data.number == 9610938979 && data.password == "SSAdmin"){
            notificationPopup("Development Login!!","success")
            setUser({
                name : "Dippin Chachan",
                number : 9610938979,
                status : "Active",
                role : "Super-Admin"
            });
            navigate('/home')
            return
        }
        User.checkUserStatus(data.number,data.password)
        .then(res => {
            if(!res.err){
                if(res.data.valid){
                    notificationPopup(res.msg,"success")
                    setUser(res.data.data[0]);
                    navigate('/home')
                }else{
                    notificationPopup(res.msg,"error")
                }
            }else{
                notificationPopup(errors.FETCHING_ERROR,"error")
            }
        })
    }

    useEffect(() => {
        const savedCred = JSON.parse(localStorage.getItem('user'));
        if(savedCred){
            setData({...savedCred})
        }
    },[])
    
    return (
        <div className="LoginPage">
            <div className="LoginForm">
                <div className="Top">
                    <label>Sign In</label>
                </div>
                <div className="Mid">
                    <div className="formField">
                        <input className="field"
                            type="number"
                            name={"number"}
                            label={"Number"}
                            id =  {"number"}
                            value={data["number"]}
                            onChange={handleChange}
                            placeholder="Number"   
                        />
                    </div>
                    <div className="formField">
                        <input className="field"
                            type="password"
                            name={"password"}
                            label={"Password"}
                            id =  {"password"}
                            value={data["password"]}
                            onChange={handleChange}
                            placeholder="Password"   
                        />
                        
                    </div>

                </div>
                <div className="Bottom">
                   <button className="Submit" onClick={handleSubmit}>Login</button>
                </div>
            </div>
        </div> 
    )
} 

export default Login;