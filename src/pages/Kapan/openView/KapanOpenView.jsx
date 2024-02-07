import "./KapanOpenView.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Chart from "../../../components/chart/Chart";
import Datatable from "../../Cut/dataTable/CutDataTable";
import { Kapan} from "../../../apis/api.kapan";
import { useEffect, useState } from "react";
import React from "react";
import { useParams } from "react-router-dom";
import { Cut } from "../../../apis/api.cut";
import {  useUser } from "../../../context/kapanContext";


const Single = ({postProcess}) => {  
  const [user,setUser] = useUser();
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="bottom">
          <Datatable postProcess={postProcess}/>
        </div>
      </div>
    </div>
  );
};

export default Single;
