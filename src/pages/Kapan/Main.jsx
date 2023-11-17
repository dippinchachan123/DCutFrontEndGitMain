import "./list.scss"
import Sidebar from "../../components/sidebar/Sidebar"
import Navbar from "../../components/navbar/Navbar"
import Datatable from "./dataTable/KapanDataTable"
import { useRequireAuth, useUser } from "../../context/kapanContext";

const Kapans = () => {
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

export default Kapans
