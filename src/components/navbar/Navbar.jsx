import "./navbar.scss";
import { Link, useNavigate } from "react-router-dom";
import SearchOutlinedIcon from "@mui/icons-material/SearchOutlined";
import LanguageOutlinedIcon from "@mui/icons-material/LanguageOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import FullscreenExitOutlinedIcon from "@mui/icons-material/FullscreenExitOutlined";
import NotificationsNoneOutlinedIcon from "@mui/icons-material/NotificationsNoneOutlined";
import ChatBubbleOutlineOutlinedIcon from "@mui/icons-material/ChatBubbleOutlineOutlined";
import ListOutlinedIcon from "@mui/icons-material/ListOutlined";
import { DarkModeContext } from "../../context/darkModeContext";
import Logo from '../../LOGO.jpeg'
import { useContext, useState } from "react";
import { useUser } from "../../context/kapanContext";

const Navbar = () => {
  const { dispatch } = useContext(DarkModeContext);
  const [inputText,setInputText] = useState("");
  const [user,setUser] = useUser();
  
  function handleChange(e){
      const value = e.target.value;
      setInputText(value)
  }
  
  function handleSearch(){
      console.log(inputText)
  }
  return ( user && 
    <div className="navbar">
      <div className="wrapper">
        {/* <div className="search">
          <input 
            type="text" 
            placeholder="Search..."  
            onChange={handleChange}
          />
          <span onClick={handleSearch}>
            <SearchOutlinedIcon />
          </span>
          
        </div> */}
        <div className= "LOGO">
          <img className={"Logo"} src={Logo} width= '255px' height={'fit-content'} style={{padding : "0px"}}/>
          {/* <span className="logo">SBG</span> */}
        </div>
        <div className="topProfile">
          {/* <div className="item">
              <img
                src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
                alt=""
                className="avatar"
              />
          </div> */}
          <div style={{display : "flex",flexDirection : "column",fontSize : 14,fontWeight : 900}}>
            <div style={{width : 'max-content'}}>{user.name?user.name:user.staff.label}</div>
            <div style={{width : 'max-content'}}>{user.number}</div>  
          </div>

        </div>
        <div className="items">
          {/* <div className="item">
            <LanguageOutlinedIcon className="icon" />
            English
          </div>
          <div className="item">
            <DarkModeOutlinedIcon
              className="icon"
              onClick={() => dispatch({ type: "TOGGLE" })}
            />
          </div>
          <div className="item">
            <FullscreenExitOutlinedIcon className="icon" />
          </div>
          <div className="item">
            <NotificationsNoneOutlinedIcon className="icon" />
            <div className="counter">1</div>
          </div>
          <div className="item">
            <ChatBubbleOutlineOutlinedIcon className="icon" />
            <div className="counter">2</div>
          </div>
          <div className="item">
            <ListOutlinedIcon className="icon" />
          </div> */}
          {/* <div className="item">
            <img
              src="https://images.pexels.com/photos/941693/pexels-photo-941693.jpeg?auto=compress&cs=tinysrgb&dpr=2&w=500"
              alt=""
              className="avatar"
            />
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Navbar;
