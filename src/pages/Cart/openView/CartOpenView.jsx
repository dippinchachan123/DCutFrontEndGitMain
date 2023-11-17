import "./CartOpenView.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Datatable from "../dataTable/CartDataTable";
import React from "react";
import { useParams } from "react-router-dom";
import {  useUser } from "../../../context/kapanContext";

const Single = ({postProcess}) => {  
  const {id} = useParams()
  const [user,setUser] = useUser();
  
  
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="bottom">
          <Datatable ids={id} postProcess={postProcess}/>
        </div>
      </div>
    </div>
  );
};

export default Single;
