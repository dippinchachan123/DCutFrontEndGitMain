import "../../../commonScss/Form.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import { getSearchComboBoxOptions } from "../../../helpers/functions";
import notificationPopup from "../../../helpers/notifications";
import { errors } from "../../../enums/messages";
import { Kapan } from "../../../apis/api.kapan";
import {  useUser } from "../../../context/kapanContext";


const New  = ({postProcess}) => {
    const [data,setData] = useState({status : "PENDING",weight : 0});
    const navigate = useNavigate();

    const [user,setUser] = useUser();
    

    const title = postProcess?"Add New PostProcess":"Add New Kapan"

    const inputs = [
        {
        id: 1,
        label: "Name",
        type: "text",
        placeholder: "A",
        },
        {
        id: 2,
        label: "Weight",
        type: "number",
        placeholder: "100",
        },
        {
        id: 3,
        label: "Pieces",
        type: "number",
        placeholder: "10",
        },
        {
        id: 4,
        label: "Size",
        type: "number",
        placeholder: 0,
        },
        {
        id: 5,
        label: "Remarks",
        type: "text",
        },
    ];

    const handleSubmit = (e)=>{
        const val = validate(data);
        if(!val.status){
            notificationPopup(val.msg,"error")
            return
        }
        
        Kapan.addKapan(data,postProcess)
        .then(res => {
            if(res.err){
            notificationPopup(res.msg,"error")
            }
            else{
            notificationPopup(res.msg,"success")
            navigate(`/${postProcess?"PP":""}kapans`);
            }
        })
        .catch(err => {
            notificationPopup(errors.SAVE_ERROR,"error")
        })
    }

    function validate(data){
        if(!data.weight){
            return {status : false,msg : "Invalid Weight!!"}
        }
        if(!data.pieces){
            return {status : false,msg : "Invalid Pieces!!"}
        }
        return {status : true,msg : ""}
    }

    const handleChange = (e)=>{
        const name = e.target.name
        const type = e.target.type;
        const value = type == "number"?Number(name == "img"?e.target.files[0]:e.target.value):
        name == "img"?e.target.files[0]:e.target.value
        
        let size = 0;
        if(name == "pieces"){
            size = (data.weight || 0) / value
        }else if(name == "weight"){
            size = value/(data.pieces || 1)
        }else{
            size = (data.weight || 0)/(data.pieces || 1)
        }

        setData({...data,[name] : value ,size : size.toFixed(2)})
    }
    
    return (
        <div className="new">
        <Sidebar />
        <div className="newContainer">
            <Navbar />
            <div className="top">
                <h1>{title}</h1>
            </div>
            <div className="bottom">  
           

            <div className="right">
                <form className="formInput">
                {inputs.map((input) => {
                    if(input.type == "select"){
                        return(
                            <div className="formInput" key={input.id}>
                                <label htmlFor="selectBox">{input.label}</label>
                                <select
                                    id = {"selectBox" + input.label} 
                                    name = {input.label.toLowerCase()} 
                                    value = {data?data[input.label.toLowerCase()] : ""} 
                                    onChange = {handleChange}
                                >
                                {getSearchComboBoxOptions(input.options)}
                                </select>
                            </div>
                        )
                    }
                        return (
                            <div className="formInput" key={input.id}>
                                <label>{input.label}</label>
                                <input 
                                type= {input.type}
                                value={data?data[input.label.toLowerCase()] : ""} 
                                name =  {input.label.toLowerCase()} 
                                onChange={handleChange}
                                placeholder={input.placeholder} 
                                disabled = {input.label.toLowerCase() == "size"?true:false}
                                />
                            </div>
                        )}
                )}
                </form>
                <button className="button" onClick={handleSubmit}>Send</button>
            </div>
            </div>
        </div>
        </div>
    );
};

export default New;
