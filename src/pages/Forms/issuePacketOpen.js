import React from 'react';
import './IssuePacketsOpen.scss';
import CancelIcon from '@mui/icons-material/Cancel';
import { Main } from '../../apis/Main';
import { useUser } from '../../context/kapanContext';


const IssuedPacketForm = ({headerDetails,StaffData,onClose ,onSubmit}) => {
  const [user,setUser] = useUser();
  console.log("StaffData : ",StaffData)
  return (
    <div className="IssuedPackets">
      <div className="form-Top-header">
        <h2>Issued Packet</h2>      
        <span className="close-button" onClick={onClose}>
            <CancelIcon />
        </span>
      </div>

      <div className='form-Next-Header'>
        <h4>k No. : {headerDetails.kapanId}</h4>
        <h4>C No. : {headerDetails.cutId}</h4>
        <h4>P NO. : {headerDetails.id}</h4>
      </div>

      <div className='StaffDetails'>
        <div className='card'>ID : {StaffData.split("-")[0]}</div>
        <div className='card' style={{width : '200px'}}>{StaffData.split("-")[1]}</div>
      </div>

      <div className="Submit">
        {!Main.isStaff(user) && <button onClick={(e) => onSubmit(e,headerDetails.id)}>Un-Issue</button>}
      </div>
    </div>
  );
};

export default IssuedPacketForm;
