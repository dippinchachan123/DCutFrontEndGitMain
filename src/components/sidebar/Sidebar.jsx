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
        <div className="item">
            <img
              src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="avatar"
            />
        </div>
        <div style={{display : "flex",flexDirection : "column",fontSize : 14,fontWeight : 900}}>
          <div>{user.name?user.name:user.staff.label}</div>
          <div>{user.number}</div>  
        </div>

      </div>
      <div className="center">
        <ul>
          <p className="title">MAIN</p>
            {/* {!Main.isStaff(user) && <Link to="/home" style={{ textDecoration: "none" }}>
              <li>
                <DashboardIcon className="icon" />
                <span>Dashboard</span>    
              </li>
            </Link>} */}
            {!(Main.isStaff(user) && Main.isPostProcess(user)) && <Link to="/kapans" style={{ textDecoration: "none" }}>
              <li>
                <FactoryIcon className="icon" />
                <span>Processes</span>
              </li>
            </Link>}
            {!(Main.isStaff(user) && Main.isPreProcess(user)) && <Link to="/PPkapans" style={{ textDecoration: "none" }}>
              <li>
                <ConstructionIcon className="icon" />
                <span>Post Processes</span>
              </li>
            </Link>}
          {!Main.isStaff(user) && <p className="title">LISTS</p>}
          {!Main.isStaff(user) && <Link to="/users" style={{ textDecoration: "none" }}>
            <li>
              <PersonOutlineIcon className="icon" />
              <span>Users</span>
            </li>
          </Link>}
          {(Main.isSuperAdmin(user) || Main.isAdmin(user)) && 
            <Link to="/Staffs" style={{ textDecoration: "none" }}> 
              <li>           
                <SettingsSystemDaydreamOutlinedIcon className="icon" />
                <span>Staff</span>
              </li>
            </Link>
          }
          {/* <Link  style={{ textDecoration: "none" }}>
            <li>
              <StoreIcon className="icon" />
              <span>Products</span>
            </li>
          </Link>
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
          </li> */}
          {!Main.isStaff(user) && <p className="title">SERVICE</p>}
          <li>
            <PsychologyOutlinedIcon className="icon" />
            <span onClick={()=> {console.log(Main.isAdmin(user),Main.isStaff(user),Main.isSuperAdmin(user))}}>Logs</span>
          </li>
          {/* <li>
            <SettingsApplicationsIcon className="icon" />
            <span>Settings</span>
          </li> */}
          <p className="title">USER</p>
          {/* <li>
            <AccountCircleOutlinedIcon className="icon" />
            <span>Profile</span>
          </li> */}
          <span onClick={handleLogOut}>
            <li>
              <ExitToAppIcon className="icon" />
              <span>
                Logout
              </span>
            </li>
          </span>
          
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
