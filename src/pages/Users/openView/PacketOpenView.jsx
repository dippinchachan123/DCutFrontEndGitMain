import "../../Cart/openView/CartOpenView.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Datatable from "../dataTable/DataTable";
import React from "react";
import { useParams } from "react-router-dom";
import { useRequireAuth, useUser } from "../../../context/kapanContext";

const Users = () => {  
  const [user,setUser] = useUser();
  
  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="bottom">
          <Datatable/>
        </div>
      </div>
    </div>
  );
};

export default Users;
