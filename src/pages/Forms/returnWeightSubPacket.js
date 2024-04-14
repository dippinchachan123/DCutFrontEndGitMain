import React, { useEffect, useState } from 'react';
import styles from './returnWeight.module.scss'; // Create a CSS file for styling
import { PRE_PROCESS_TYPES } from '../../enums/processes';
import CancelIcon from '@mui/icons-material/Cancel';



const SubReturnForm = ({ headerDetails ,weights,onClose , onSubmission}) => {
  const [data, setData] = useState(weights || {
    weight : 0,
    pieces : 0
  });

  const handleChange = (e,isW = true)=>{
    const name = e.target.name
    const type = e.target.type;
    const value = type == "number"?Number(name == "img"?e.target.files[0]:e.target.value):
    name == "img"?e.target.files[0]:e.target.value
    const newState = {...data}
    newState[name] = value
    
    //Validations
    // if(name == "weight"){
    //     if(headerDetails.weight < newState.weight){
    //       return
    //     }
    // }
    // if(name == "pieces"){
    //   if(headerDetails.pieces < newState.pieces){
    //     return
    //   }
    // }

    //Setting State
    setData(newState)
  }

  const processes = Object.keys(PRE_PROCESS_TYPES).map((process)=>{
    return(
        <option key={process} value={process}>{process}</option>
    )
  })

  return (
    <div className={styles['gamified-form']} style={{height : '350px'}}>
      
      <div className={styles['form-header']}>
        <span className={styles['close-button']} onClick={onClose}>
            <CancelIcon />
        </span>
      </div>

      <div style={{display:'flex',flexDirection:'column',alignItems  : 'flex-start'}}>
        <div style={{padding : '5px',margin : '5px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>PacketID : </b>{headerDetails.packetID}</div>
        <div style={{display : 'flex',columnGap : '10px'}}>
          <div style={{padding : '5px',margin : '5px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>Pieces : </b> {headerDetails.pieces}</div>
          <div style={{padding : '5px',margin : '5px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>Weight : </b> {headerDetails.weight}</div>
        </div>
      </div>
      

      <form onSubmit={(e)=> e.preventDefault()}>
        
        <div className={styles["formFields"]} style={{height : '100px'}}>
          {
              <div className={styles['form-group']}>
                <div style={{display:'flex',columnGap:'185px',marginTop : '5pxpx'}}>
                  <h5>pieces</h5>
                  <h5>weight</h5>
                </div>
                <div style={{display:'flex',columnGap:'10px',marginTop : '3px'}}>
                  <input
                    type="number"
                    name={"pieces"}
                    label={"Pieces"}
                    id =  {"pieces"}
                    value={data.pieces || 0}
                    onChange={(e)=> handleChange(e,false)}
                    placeholder="Enter piece"
                  />
                  <input
                    type="number"
                    name={"weight"}
                    label={"Weight"}
                    id =  {"weight"}
                    value={data.weight || 0}
                    onChange={handleChange}
                    placeholder="Enter weight"
                    width={'200px'}
                  />
                 
                </div>
              </div>
          }
        </div>
        <div style={{display:'flex',flexDirection:'row',alignItems  : 'flex-start'}}>
          <div style={{padding : '5px',margin : '5px',marginTop : '10px',marginBottom : '40px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>Return Pieces : </b> {data.pieces}</div>
          <div style={{padding : '5px',margin : '5px',marginTop : '10px',marginBottom : '10pxpx',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>Return Weight : </b> {data.weight}</div>
        </div>
        <div className={styles['form-buttons']}>
          <button className='red-button' style={{fontWeight : '1000',marginLeft : '5px',backgroundColor : 'red'}} onClick={(e) => onSubmission(e,null,headerDetails.id,true)}>Un-Return</button>
          <button onClick={(e) => onSubmission(e, data,headerDetails.id)}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default SubReturnForm;
