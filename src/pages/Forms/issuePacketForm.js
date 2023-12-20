import React, { useEffect, useState } from 'react';
import './IssuePackets.scss';
import { PRE_PROCESS_TYPES } from '../../enums/processes';
import CancelIcon from '@mui/icons-material/Cancel';
import { Staff } from '../../apis/api.staff';
import notificationPopup from '../../helpers/notifications';


const IssueForm = ({headerDetails,PacketsData,onClose ,onSubmit,postProcess}) => {

  const [data, setData] = useState({
    user : ""
  });
  const[staffs,setStaffs] = useState([])

  const handleChange = (e)=>{
    const name = e.target.name
    const type = e.target.type;
    const value = type == "number"?Number(name == "img"?e.target.files[0]:e.target.value):
    name == "img"?e.target.files[0]:e.target.value
    setData({...data,[name] : value })
  }

  const processes = (staffs) =>  {
    const options = [];
    staffs.forEach((staff)=>{
      if(staff.status == "Active"){
        options.push(<option key={staff.id} value={staff.id.toString() + "-" + staff.name.toString()}>{staff.name}</option>)
      }
    })
    console.log(options)
    return options
  }

  useEffect(()=>{
    Staff.getStaffs(postProcess?"Post-Process":"Pre-Process")
    .then(res => {
       if(!res.err){
         setStaffs(res.data)
         setData({user : res.data[0].id.toString() + '-' + res.data[0].name.toString(),number : res.data[0].number.toString()})
       }
       else{
         notificationPopup(res.msg,"error")
       }
    }) 
    .catch(err => {
       notificationPopup(err,"error")
    })
  },[])

 

  return (
    <div className="IssuePackets">
      <div className="form-Top-header">
        <h2>Issue Packets</h2>      
        <span className="close-button" onClick={onClose}>
            <CancelIcon />
        </span>
      </div>

      <div className='form-Next-Header'>
        <h4>kapan ID : {headerDetails.kapanId}</h4>
        <h4>Cut ID : {headerDetails.cutId}</h4>
      </div>


      <form onSubmit={(e)=> e.preventDefault()}>
        <div className="form-group">
          <div><h2 className='label'>Staff</h2></div>
          <select
            id="selectBoxSink"
            type = "select"
            name='user'
            value={data?.user}
            onChange={handleChange}
          >
            {processes(staffs)}
          </select>
        </div>
        <div className='Packets'>
          <div className='row Heading'>
            <h4 className='entry'>Packet ID</h4>
            <h4 className='entry'>Weight</h4>
            <h4 className='entry'>Pieces</h4>
          </div>
          {

            PacketsData.length && PacketsData.map(packet => {
              if(packet.return && packet.return.returnWeight){
                return;
              }
              return(<div key={packet.id} className ='row'>
                <h4 className='entry'>{packet.packetId}</h4>
                <h4 className='entry'>{packet.weight}</h4>
                <h4 className='entry'>{packet.pieces}</h4>
              </div>)
            })
          }
        </div>
        <div className="Submit">
            <button onClick={(e) => onSubmit(e,{user : data?.user,number : data?.number,packets : PacketsData})}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default IssueForm;
