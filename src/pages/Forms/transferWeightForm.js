import React, { useState } from 'react';
import styles from './transferWeight.module.scss';
import { POST_PROCESS_TYPES, POST_PROCESS_TYPES_Keys, PRE_PROCESS_TYPES } from '../../enums/processes';
import CancelIcon from '@mui/icons-material/Cancel';
import { Main } from '../../apis/Main';

const TWForm = ({ source ,onClose ,onSubmit,postProcess}) => {
  console.log("PostPP : ",postProcess)
  const [data, setData] = useState({
    source : source,
    sink : PRE_PROCESS_TYPES.POLISHED,
    weight : 0
  });

  const handleChange = (e)=>{
    const name = e.target.name
    const type = e.target.type;
    const value = type == "number"?Number(name == "img"?e.target.files[0]:e.target.value):
    name == "img"?e.target.files[0]:e.target.value
    setData({...data,[name] : value })
  }

  const processes = Object.keys(postProcess?POST_PROCESS_TYPES_Keys:PRE_PROCESS_TYPES).map((process)=>{
    return(
        <option key={process} value={process}>{postProcess?POST_PROCESS_TYPES[process]:process.replace("_"," ")}</option>
    )
  })

 

  return !Main.isStaff() && (
    <div className={styles['gamified-form']}>
      <div className={styles['form-header']}>
        <span className={styles['close-button']} onClick={onClose}>
            <CancelIcon />
        </span>
      </div>

      <div className={styles["form-group"]}>
          <label htmlFor="selectBox">Weight From</label>
          <select
            id="selectBoxSource"
            name='source'
            value={data?.source}
            onChange={handleChange}
          >
            {processes}
          </select>
        </div>

      <form onSubmit={(e)=> e.preventDefault()}>
        <div className={styles["form-group"]}>
          <label htmlFor="weight">Weight</label>
          <input
            type="number"
            name='weight'
            id="weight"
            value={data?.weight}
            onChange={handleChange}
            placeholder="Enter weight"
          />
        </div>


        <div className={styles["form-group"]}>
          <label htmlFor="selectBox">Weight To</label>
          <select
            id="selectBoxSink"
            name='sink'
            value={data?.sink}
            onChange={handleChange}
          >
            {processes}
          </select>
        </div>
        <div className={styles["form-group"]}>
          <button onClick={(e) => onSubmit(e,data)}>Submit</button>
        </div>
      </form>
    </div>
  );
};

export default TWForm;
