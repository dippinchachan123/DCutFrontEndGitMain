import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "./dataTable/KapanDataTable"
import {  useUser } from "../../context/kapanContext";

const Kapans = ({postProcess}) => {
  const [user,setUser] = useUser();
  

  return (
    <div className="list">
      <Sidebar/>
      <div className="listContainer">
        <Navbar/>
        <Datatable postProcess={postProcess}/>
      </div>
    </div>
  )
}

export default Kapans
