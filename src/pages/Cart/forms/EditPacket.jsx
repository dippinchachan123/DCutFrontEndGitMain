import "../../../commonScss/Form.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { getSearchComboBoxOptions } from "../../../helpers/functions";
import notificationPopup from "../../../helpers/notifications";
import { errors,success } from "../../../enums/messages";
import { Cart } from "../../../apis/api.cart";
import AddIcon from '@mui/icons-material/Add';
import ArrowDropDownCircleSharpIcon from '@mui/icons-material/ArrowDropDownCircleSharp';
import { Select, MenuItem, Button,TextField } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { Fields } from "../../../apis/api.fields";
import { PRE_PROCESS_TYPES } from "../../../enums/processes";
import {  useUser } from "../../../context/kapanContext";


const Edit  = ({postProcess}) => {
    const [data,setData] = useState({status : "PENDING",weight : 0});
    const ids = useParams().id
    let [kapanId,cutId,process,id] = ids.split("-").map(ele => {
        if (!isNaN(ele)) {
            // If it's a number, parse it using parseInt
            return parseInt(ele, 10); // The second argument specifies the base (e.g., base 10 for decimal)
          } else {
            // If it's not a number, return the original value
            return ele;
          }
    });

    if(postProcess){
        kapanId = 1
    }

    const [user,setUser] = useUser();
    

    const [charni, setCharni] = useState([]);
    const [cutting, setCuttting] = useState([]);
    const [color, setColor] = useState([]);

    const [addOptionVisibility,setAddOptionVisibility]  = useState({
            charni : {active : false,value : ""},
            color : {active : false,value : ""},
            cutting : {active : false,value : ""}
        }
    )

    const navigate = useNavigate();
    const title = "Edit Main Packet"

    const inputs = [
        {
        id: 2,
        label: "Weight",
        type: "number",
        placeholder: "100",
        },
        {
        id: 3,
        label: "Pieces",
        type: "number",
        placeholder: "10",
        },
        {
        id: 4,
        label: "Size",
        type: "number",
        placeholder: 0,
        },
        {
        id: 5,
        label: "Remarks",
        type: "text",
        },
        {
        id: 6,
        label: "Status",
        type: "select",
        options : ["PENDING","IN-PROCESS","PROCESSED"]
        },

    ];

    const handleSubmit = (e)=>{
        Cart.editPacket(kapanId,cutId,process,id,data,postProcess)
        .then(res => {
            if(res.err || !res.data){
                notificationPopup(res.msg,"error")
            }
            else{
                notificationPopup(res.msg,"success")
                navigate(`/${postProcess?"PP":""}cart/${kapanId}-${cutId}-${process}`);
            }
        })
        .catch(err => {
            notificationPopup(errors.SAVE_ERROR,"error")
        })
    }

    const handleChange = (e)=>{
        const name = e.target.name
        const type = e.target.type;
        const value = type == "number"?Number(name == "img"?e.target.files[0]:e.target.value):
        name == "img"?e.target.files[0]:e.target.value
        
        let size = 0;
        if(name == "pieces"){
            size = (data.weight || 0) / value
        }else if(name == "weight"){
            size = value/(data.pieces || 1)
        }else{
            size = (data.weight || 0)/(data.pieces || 1)
        }

        setData({...data,[name] : value ,size : size.toFixed(2)})
    }

    const handleChangeAddNewField = (e) => {
        const name = e.target.name
        const type = e.target.type;
        const value = type == "number" ? Number(name == "img" ? e.target.files[0] : e.target.value) :
            name == "img" ? e.target.files[0] : e.target.value
        
        const newUpdtData = {...addOptionVisibility}
        newUpdtData[name].value = value
        setAddOptionVisibility(newUpdtData)
    }

    const removeOptionsInSelect = (e,fieldName, field, setField, id) => {
        Fields.deleteFieldsByID(fieldName,id)
        .then(res => {
            if(res.data.modifiedCount > 0){
                setField(field.filter(ele => {
                    if (data[fieldName] && data[fieldName].id == id) {
                        setData({ ...data, [fieldName]: null })
                    }
                    return ele.id != id
                }))
                notificationPopup(success.DELETION_SUCCESS,"success")
            }
            else{
                notificationPopup(errors.DELETION_ERROR,"error")
            }
        })
        .catch(err => {
            notificationPopup(errors.DELETION_ERROR,"error")
        })
        
    }

    const addOptionsInSelect = (e,fieldName, field, setField) => {
        Fields.addField(fieldName,{value : addOptionVisibility[fieldName].value})
        .then(res => {
            if(res.data.modifiedCount > 0){
                const newField = [...field]
                console.log(addOptionVisibility)
                const maxId = field.reduce((max, obj) => {
                    return obj.id > max ? obj.id : max;
                }, -Infinity);
                if(addOptionVisibility[fieldName].value && addOptionVisibility[fieldName].value != ""){
                    newField.push({id : maxId + 1,value : addOptionVisibility[fieldName].value})
                    toggleAddOptions(fieldName)
                    console.log(newField)
                    setField([...newField])
                }
                notificationPopup(success.SAVE_SUCCESS,"success")
            }
            else{
                notificationPopup(errors.SAVE_ERROR,"error")
            }
        })
        .catch(err => {
            notificationPopup(errors.SAVE_ERROR,"error")
        })
        
    }

    const toggleAddOptions = (fieldName) => {
        setAddOptionVisibility({...addOptionVisibility,[fieldName] : {active : !addOptionVisibility[fieldName].active,value : ""}})
    }

    useEffect(()=>{
        Fields.getFields(postProcess)
        .then(res => {
           if(!res.err){
                console.log("Data : ",res)
                const resData = res.data[0];
                setCharni(resData.charni)
                setColor(resData.color)
                setCuttting(resData.cutting)
           }
           else{
             notificationPopup(res.msg,"error")
           }
        }) 
        .catch(err => {
           notificationPopup(err,"error")
        })
    },[])


    useEffect(() => {
        Cart.getPacket(kapanId,cutId,process,id,postProcess)
        .then(res => {
            if(res.err){
                notificationPopup(res.msg,"error")
            }
            else{
                setData(res.data[0].packet[0])
            }
        })
        .catch(err => {
            notificationPopup(errors.SAVE_ERROR,"error")
        })
    },[])



    const pc = PRE_PROCESS_TYPES;
    
    return (
        <div className="new">
        <Sidebar />
        <div className="newContainer">
            <Navbar />
            <div className="top">
                <h1>{title}</h1>
            </div>
            <div className="bottom">  
            <div className="right">
                <form className="formInput">
                {inputs.map((input) => {
                    if(input.type == "select"){
                        return(
                            <div className="formInput" key={input.id}>
                                <label htmlFor="selectBox">{input.label}</label>
                                <select
                                    id = {"selectBox" + input.label} 
                                    name = {input.label.toLowerCase()} 
                                    value = {data?data[input.label.toLowerCase()] : ""} 
                                    onChange = {handleChange}
                                >
                                {getSearchComboBoxOptions(input.options)}
                                </select>
                            </div>
                        )
                    }
                        return (
                            <div className="formInput" key={input.id}>
                                <label>{input.label}</label>
                                <input 
                                type= {input.type}
                                value={data?data[input.label.toLowerCase()] : ""} 
                                name =  {input.label.toLowerCase()} 
                                onChange={handleChange}
                                placeholder={input.placeholder} 
                                disabled = {input.label.toLowerCase() == "size"?true:false}
                                />
                            </div>
                        )}
                )}

                {!postProcess && [pc.POLISH_LOTING,pc.POLISH_TABLE_LOTING,pc.GHAT_LOTING].includes(process) 
                && <div className="formInput" key={"Charni"}>
                    <label htmlFor="selectBox">Charni</label>
                    <div className='selectBoxContainer'>
                        <Select className="SelectBox"
                            value={data ? data["charni"] : ""}
                            name={"charni"}
                            onChange={handleChange}
                        >
                            {charni.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    <div style={{ display: "flex", flexDirection: "row", columnGap: '180px', alignItems: 'center' }}>
                                        <div>{option.value}</div>
                                        <Button variant="sideButton" style={{ margin: 0, height: '30px' }} onClick={(e) => removeOptionsInSelect(e, "charni", charni, setCharni, option.id)} >
                                            <CloseIcon sx={{ fontSize: '40px', alignSelf: 'center' }} />
                                        </Button>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <Button variant="contained" style={{ margin: 0, height: '49px' }} onClick={()=>toggleAddOptions("charni")}>
                            <ArrowDropDownCircleSharpIcon sx={{ fontSize: '30px', alignSelf: 'center' , transform: `rotate(${addOptionVisibility.charni.active?180:0}deg)` }} />
                        </Button>
                    </div>
                    {addOptionVisibility.charni.active && 
                        <div style={{display  : "flex",justifyContent : 'left',alignItems : 'center',marginTop : '5px'}}>
                            <TextField 
                            variant="filled" 
                            name= "charni"
                            onChange={handleChangeAddNewField}
                            />
                            <Button variant="contained" style={{ margin : 0,marginLeft : '7px', height: '32px',width : '20px' }} onClick={(e) => addOptionsInSelect(e, "charni", charni, setCharni)}>
                                <AddIcon sx={{ fontSize: '20px', alignSelf: 'center' }} />
                            </Button>
                        </div>    
                    }
                </div>}

                {!postProcess && [pc.POLISH_LOTING,pc.POLISH_TABLE_LOTING].includes(process) 
                && <div className="formInput" key={"Color"}>
                    <label htmlFor="selectBox">Color</label>
                    <div className='selectBoxContainer'>
                        <Select className="SelectBox"
                            value={data ? data["color"] : ""}
                            name={"color"}
                            onChange={handleChange}
                            renderValue={(selected) => (
                                // Custom rendering for the selected value
                                <div>{selected?.value}</div>
                              )}                     
                            >
                            {color.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    <div style={{ display: "flex", flexDirection: "row", columnGap: '180px', alignItems: 'center' }}>
                                        <div>{option.value}</div>
                                        <Button variant="sideButton" style={{ margin: 0, height: '30px' }} onClick={(e) => removeOptionsInSelect(e, "color", color, setColor, option.id)} >
                                            <CloseIcon sx={{ fontSize: '40px', alignSelf: 'center' }} />
                                        </Button>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <Button variant="contained" style={{ margin: 0, height: '60px' }} onClick={()=>toggleAddOptions("color")}>
                            <ArrowDropDownCircleSharpIcon sx={{ fontSize: '30px', alignSelf: 'center' , transform: `rotate(${addOptionVisibility.color.active?180:0}deg)` }} />
                        </Button>
                    </div>
                    {addOptionVisibility.color.active && 
                        <div style={{display  : "flex",justifyContent : 'left',alignItems : 'center',marginTop : '5px'}}>
                        <TextField 
                        variant="filled" 
                        name= "color"
                        onChange={handleChangeAddNewField}
                        />
                        <Button variant="contained" style={{ margin : 0,marginLeft : '7px', height: '32px',width : '20px' }} onClick={(e) => addOptionsInSelect(e, "color", color, setColor)}>
                            <AddIcon sx={{ fontSize: '20px', alignSelf: 'center' }} />
                        </Button>
                    </div>    
                    }

                </div>}

                {!postProcess && [pc.POLISH_LOTING].includes(process)  
                && <div className="formInput" key={"Cutting"}>
                    <label htmlFor="selectBox">Cutting</label>
                    <div className='selectBoxContainer'>
                        <Select className="SelectBox"
                            value={data ? data["cutting"] : ""}
                            name={"cutting"}
                            onChange={handleChange}
                        >
                            {cutting.map((option, index) => (
                                <MenuItem key={index} value={option}>
                                    <div style={{ display: "flex", flexDirection: "row", columnGap: '180px', alignItems: 'center' }}>
                                        <div>{option.value}</div>
                                        <Button variant="sideButton" style={{ margin: 0, height: '30px' }} onClick={(e) => removeOptionsInSelect(e, "cutting" ,cutting, setCuttting, option.id)} >
                                            <CloseIcon sx={{ fontSize: '40px', alignSelf: 'center' }} />
                                        </Button>
                                    </div>
                                </MenuItem>
                            ))}
                        </Select>
                        <Button variant="contained" style={{ margin: 0, height: '60px' }} onClick={()=>toggleAddOptions("cutting")}>
                            <ArrowDropDownCircleSharpIcon sx={{ fontSize: '30px', alignSelf: 'center' , transform: `rotate(${addOptionVisibility.cutting.active?180:0}deg)` }} />
                        </Button>
                    </div>
                    {addOptionVisibility.cutting.active &&  <div style={{display  : "flex",justifyContent : 'left',alignItems : 'center',marginTop : '5px'}}>
                            <TextField 
                            variant="filled" 
                            name= "cutting"
                            onChange={handleChangeAddNewField}
                            />
                            <Button variant="contained" style={{ margin : 0,marginLeft : '7px', height: '32px',width : '20px' }} onClick={(e) => addOptionsInSelect(e, "cutting", cutting, setCuttting)}>
                                <AddIcon sx={{ fontSize: '20px', alignSelf: 'center' }} />
                            </Button>
                        </div>    
                    }

                </div>}
                </form>
                <button className="button" onClick={handleSubmit}>Send</button>
            </div>
            </div>
        </div>
        </div>
        
    );
};

export default Edit;
