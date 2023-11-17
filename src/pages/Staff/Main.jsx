import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "./datatable/StaffDataTable"
import {  useUser } from "../../context/kapanContext";

const Staff = () => {
  const [user,setUser] = useUser();
  
  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Datatable/>
      </div>
    </div>
  )
}

export default Staff
