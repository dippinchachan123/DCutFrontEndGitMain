import "./Form.scss";
import Sidebar from "../../components/sidebar/Sidebar";
import Navbar from "../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import axios from "axios";
import { Staff } from "../../apis/api.staff";
import {getSearchComboBoxOptions } from "../../helpers/functions";
import Select from "react-select";
import {  useUser } from "../../context/kapanContext";


const New  = ({ inputs, title ,handleChange,handleSubmit,mode}) => {
  const { id } = useParams();
  const [data,setData] = useState(null);
  const [user,setUser] = useUser();
  

  const navigate = useNavigate();
    useEffect(() => {
      if(mode == "edit"){
        Staff.getStaffByID(id)
        .then(res => {
          if(!res.err){
            setData(res.data)
          }
        })
        .catch(err => {
          console.log("ERROR : ",err)
        })
    }},[])

  
  
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
                if(input.type != "select"){
                  return (
                    <div className="formInput" key={input.id}>
                      <label>{input.showLabel}</label>
                      <input 
                      type = {input.type}
                      value={data?data[input.label.toLowerCase()] : ""} 
                      name =  {input.label.toLowerCase()} 
                      onChange={(e)=>handleChange(e,data,setData)}
                      placeholder={input.placeholder} />
                    </div>
                  )}
                else{
                  return (
                    <div className="formInput" key={input.id}>
                      <label>{input.showLabel}</label>
                      <select 
                        type = {input.type}
                        value={data?data[input.label.toLowerCase()] : ""} 
                        name =  {input.label.toLowerCase()} 
                        onChange={(e) => handleChange(e,data,setData)}
                        isSearchable = {true}
                        placeholder={input.placeholder}
                      >
                        {getSearchComboBoxOptions(input.options)}
                      </select>                      

                    </div>
                  )
                }
              })}
              
            </form>
            <button className="button" onClick={(e)=>handleSubmit(e,id,data,setData,navigate)}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default New;
