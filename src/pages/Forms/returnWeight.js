import React, { useEffect, useState } from 'react';
import styles from './returnWeight.module.scss'; // Create a CSS file for styling
import { POST_PROCESS_TYPES, PRE_PROCESS_TYPES } from '../../enums/processes';
import CancelIcon from '@mui/icons-material/Cancel';
import { useUser } from '../../context/kapanContext';
import { Main } from '../../apis/Main';



const ReturnForm = ({ headerDetails , weights ,onClose , onSubmission , postProcess}) => {
  const [data, setData] = useState(weights);
  const [returnWP,setReturnWP] = useState({w : 0,p : 0});
  const [user] = useUser();

  const handleChange = (e,isW = true)=>{
    const name = e.target.name
    const type = e.target.type;
    const value = type == "number"?Number(name == "img"?e.target.files[0]:e.target.value):
    name == "img"?e.target.files[0]:e.target.value
    const newState = {...data}
    newState[name][isW?"weight":"pieces"] = value

    //Validations
    // const [returnWeight,returnPieces] = calculateTotalWP(newState)
    // if(isW){
    //   if(headerDetails.weight < returnWeight){
    //     return
    //   }
    // }
    // else{
    //   if(headerDetails.pieces < returnPieces){
    //     return
    //   }
    // }

    //Setting State 
    setData(newState)
  }

  const calculateTotalWP = (data) => {
    let returnWeight = 0
    let returnPieces = 0
    Object.keys(data).forEach(key => {
        returnWeight += data[key].weight
        returnPieces += data[key].pieces

    })
    return [returnWeight,returnPieces]
  }

  useEffect(() => {
    const [returnWeight,returnPieces] = calculateTotalWP(data);
    setReturnWP({w : returnWeight,p : returnPieces})
  },[data])

  return (
    <div className={styles['gamified-form']}>
      
      <div className={styles['form-header']}>
        <span className={styles['close-button']} onClick={onClose}>
            <CancelIcon />
        </span>
      </div>

      <div style={{display:'flex',flexDirection:'column',alignItems  : 'flex-start'}}>
        <div style={{padding : '5px',margin : '5px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>PacketID : </b>{headerDetails.packetID}</div>
        <div style={{display : 'flex',columnGap : '10px'}}>
          <div style={{padding : '5px',margin : '5px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>{headerDetails.PiecesLable} : </b>{headerDetails.pieces}</div>

          <div style={{padding : '5px',margin : '5px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>{headerDetails.WeightLable} : </b>{headerDetails.weight}</div>
        </div>
      </div>
      

      <form onSubmit={(e)=> e.preventDefault()}>
        
        <div className={styles["formFields"]}>
          {
            Object.keys(weights).map(key => {
              
              return(
              <div className={styles['form-group']}>
                <label htmlFor="weight">{(postProcess?POST_PROCESS_TYPES[key]:key).replaceAll("_"," ")}</label>
                <div style={{display:'flex',columnGap:'185px',marginTop : '5pxpx'}}>
                  <h5>pieces</h5>
                  <h5>weight</h5>
                </div>
                <div style={{display:'flex',columnGap:'10px',marginTop : '3px'}}>
                  <input
                    type="number"
                    name={key}
                    label={"Pieces"}
                    id =  {key + "piece"}
                    value={data[key].pieces || 0}
                    onChange={(e)=> handleChange(e,false)}
                    placeholder="Enter piece"
                  />
                  <input
                    type="number"
                    name={key}
                    label={"Weight"}
                    id =  {key + "weight"}
                    value={data[key].weight || 0}
                    onChange={handleChange}
                    placeholder="Enter weight"
                    width={'200px'}
                  />
                
                </div>
            </div>)
            })
          }
        </div>
        <div style={{display:'flex',flexDirection:'row',alignItems  : 'flex-start' ,height : '69px'}}>
          <div style={{padding : '5px',margin : '5px',marginTop : '10px',marginBottom : '40px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>Return Pieces : </b> {returnWP.p}</div>
          <div style={{padding : '5px',margin : '5px',marginTop : '10px',marginBottom : '10px',backgroundColor : 'lightgrey',border : '5px',borderRadius : '5px'}}><b>Return Weight : </b> {returnWP.w}</div>
        </div>
        <div className={styles['form-buttons']}>
          {!Main.isStaff(user) && <button 
            className='red-button' 
            style={{fontWeight : '700',marginLeft : '5px',backgroundColor : 'rgb(287,75,53)'}} 
            onClick={(e) => {
              setData(weights)
              onSubmission(e,null,headerDetails.id,true)
              }
            }>
            Un-Return
          </button>}
          <button className='Submit' onClick={(e) => onSubmission(e,{weights : data,returnWeight : returnWP.w,returnPieces : returnWP.p},headerDetails.id)}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default ReturnForm;
