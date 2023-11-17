import "./sidebar.scss";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonOutlineIcon from "@mui/icons-material/PersonOutline";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import StoreIcon from "@mui/icons-material/Store";
import InsertChartIcon from "@mui/icons-material/InsertChart";
import SettingsApplicationsIcon from "@mui/icons-material/SettingsApplications";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import NotificationsNoneIcon from "@mui/icons-material/NotificationsNone";
import SettingsSystemDaydreamOutlinedIcon from "@mui/icons-material/SettingsSystemDaydreamOutlined";
import PsychologyOutlinedIcon from "@mui/icons-material/PsychologyOutlined";
import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import ConstructionIcon from '@mui/icons-material/Construction';
import FactoryIcon from '@mui/icons-material/Factory';
import { Link, useNavigate } from "react-router-dom";
import { DarkModeContext } from "../../context/darkModeContext";
import { useContext } from "react";
import { grey } from "@mui/material/colors";
import { Main } from "../../apis/Main";
import { useUser } from "../../context/kapanContext";

const Sidebar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const navigate = useNavigate();
  const [user,setUser] = useUser();

  const handleLogOut = ()=> {
      localStorage.setItem('user', null);
      navigate('/')
  }
  return user && (
    <div className="sidebar">
      <div className="top">
        <div ClassName = "clickables" onClick = {navigate("/")} style={{ textDecoration: "none" }}>
          <span className="logo">SBG</span>
        </div>
      </div>
      <hr />
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
          <li onClick = {()=>navigate("/")}>
            <div ClassName = "clickables"  style={{ textDecoration: "none" }}>
              <DashboardIcon className="icon" />
              <span>Dashboard</span>            
            </div>
          </li>
          <li onClick = {()=>navigate("/kapans")}>
            <div ClassName = "clickables"  style={{ textDecoration: "none" }}>
              <FactoryIcon className="icon" />
              <span>Processes</span>
            </div>
          </li>
          <li onClick = {()=>navigate("/PPkapans/1")}>
            <div ClassName = "clickables"  style={{ textDecoration: "none" }}>
              <ConstructionIcon className="icon" />
              <span>Post Processes</span>
            </div>
          </li>
          <p className="title">LISTS</p>
          {Main.isSuperAdmin(user) && <div ClassName = "clickables" onClick = {()=>navigate("/users")} style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </div>}
          <div ClassName = "clickables" onClick = {()=>navigate("/products")} style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Products</span>
            </li>
          </div>
          <li>
            <CreditCardIcon className="icon" />
            <span>Orders</span>
          </li>
          <li>
            <LocalShippingIcon className="icon" />
            <span>Delivery</span>
          </li>
          <p className="title">USEFUL</p>
          <li>
            <InsertChartIcon className="icon" />
            <span>Stats</span>
          </li>
          <li>
            <NotificationsNoneIcon className="icon" />
            <span>Notifications</span>
          </li>
          <p className="title">SERVICE</p>
          {(Main.isSuperAdmin(user) || Main.isAdmin(user)) && <li>
            <div ClassName = "clickables" onClick = {()=>navigate("/Staffs")} style={{ textDecoration: "none" }}>            
              <SettingsSystemDaydreamOutlinedIcon className="icon" />
              <span>Staff</span>
            </div>
          </li>}
          <li onClick={()=> {console.log(Main.isAdmin(user),Main.isStaff(user),Main.isSuperAdmin(user))}}>
            <PsychologyOutlinedIcon className="icon" />
            <span >Logs</span>
          </li>
          <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li>
          <p className="title">USER</p>
          <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li>
          <li onClick={handleLogOut}>
            <ExitToAppIcon className="icon" />
            <span
              >
              Logout
            </span>
          </li>
        </ul>
      </div>
      <div className="bottom">
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "LIGHT" })}
        ></div>
        <div
          className="colorOption"
          onClick={() => dispatch({ type: "DARK" })}
        ></div>
      </div>
    </div>
  );
};

export default Sidebar;
