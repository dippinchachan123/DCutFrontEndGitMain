import "../../../commonScss/Form.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { getSearchComboBoxOptions } from "../../../helpers/functions";
import notificationPopup from "../../../helpers/notifications";
import { errors } from "../../../enums/messages";
import { Cart } from "../../../apis/api.cart";
import {  useUser } from "../../../context/kapanContext";
import DataTableInfoBox from "../../../components/Shared/DataTableInfo";


const Edit = () => {
    const [data, setData] = useState({ status: "PENDING" });
    const ids = useParams().id
    const [kapanId, cutId, process, packetId, id] = ids.split("-").map(ele => {
        if (!isNaN(ele)) {
            // If it's a number, parse it using parseInt
            return parseInt(ele, 10); // The second argument specifies the base (e.g., base 10 for decimal)
        } else {
            // If it's not a number, return the original value
            return ele;
        }
    });
    const [user,setUser] = useUser();

    const [packetIn,setPacketIn] = useState({});
    const [OriginalData,setOriginalData] = useState({})
    

    const navigate = useNavigate();
    const title = "Edit Sub Packet"

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
            label: "MMValue",
            type: "text",
        },
        {
            id: 6,
            label: "Status",
            type: "select",
            options: ["PENDING", "IN-PROCESS", "PROCESSED"]
        },

    ];

    const handleSubmit = (e) => {
        const val = validate(data);
        if(!val.status){
            notificationPopup(val.msg,"error")
            return
        }

        Cart.editSPacket(kapanId, cutId, process, packetId, id, data)
            .then(res => {
                if (res.err || !res.data) {
                    notificationPopup(res.msg, "error")
                }
                else {
                    notificationPopup(res.msg, "success")
                    navigate(`/Packet/${kapanId}-${cutId}-${process}-${packetId}`);
                }
            })
            .catch(err => {
                notificationPopup(errors.SAVE_ERROR, "error")
            })
    }

    function validate(data){
        console.log("Validating Data : ",data)
        if(!data.weight){
            return {status : false,msg : "Invalid Weight!!"}
        }
        if(!data.pieces){
            return {status : false,msg : "Invalid Pieces!!"}
        }
        if(!data.mmvalue){
            return {status : false,msg : "Invalid MM Value!!"}
        }
        if(packetIn.weight - packetIn.subPacketsDetails.totalWeightIn - data.weight + OriginalData.weight < 0){
            return {status : false,msg : `Weight Limit Excedded by ${-(packetIn.weight - packetIn.subPacketsDetails.totalWeightIn - data.weight + OriginalData.weight)}!!`}
        }
        
        return {status : true,msg : ""}
    }

    const handleChange = (e) => {
        const name = e.target.name
        const type = e.target.type;
        const value = type == "number" ? Number(name == "img" ? e.target.files[0] : e.target.value) :
            name == "img" ? e.target.files[0] : e.target.value

        let size = 0;
        if (name == "pieces") {
            size = (data.weight || 0) / value
        } else if (name == "weight") {
            size = value / (data.pieces || 1)
        } else {
            size = (data.weight || 0) / (data.pieces || 1)
        }

        setData({ ...data, [name]: value, size: size.toFixed(2) })
    }

    useEffect(() => {
        Cart.getSPacket(kapanId, cutId, process, packetId, id)
            .then(res => {
                if (res.err) {
                    notificationPopup(res.msg, "error")
                }
                else {
                    console.log("Data : ",res.data[0].subPacket[0])
                    setData(res.data[0].subPacket[0])
                    setOriginalData(res.data[0].subPacket[0])
                }
            })
            .catch(err => {
                notificationPopup(errors.SAVE_ERROR, "error")
            })
    }, [])

    useEffect(()=>{
        Cart.getPacket(kapanId,cutId,process,packetId)
        .then(res => {
            if(!res.err){
                setPacketIn(res.data[0].packets[0])
            }
            else{
               throw new Error("Error in loading kapan Weight!!")
            }
        })
        .catch(err => {
            
            notificationPopup("Error in loading kapan Weight!!","error")
        })
    },[])

    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <DataTableInfoBox infoData={[{label : "Main Packet Weight left", value : (packetIn.weight || 0)- (packetIn.subPacketsDetails?.totalWeightIn || 0) - (data.weight || 0) + (OriginalData.weight || 0)}]}
                style={{margin : '20px'}}/>
                <div className="bottom">

                    <div className="right">
                        <form className="formInput">
                            {inputs.map((input) => {
                                if (input.type == "select") {
                                    return (
                                        <div className="formInput" key={input.id}>
                                            <label htmlFor="selectBox">{input.label}</label>
                                            <select
                                                id={"selectBox" + input.label}
                                                name={input.label.toLowerCase()}
                                                value={data ? data[input.label.toLowerCase()] : ""}
                                                onChange={handleChange}
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
                                            type={input.type}
                                            value={data ? data[input.label.toLowerCase()] : ""}
                                            name={input.label.toLowerCase()}
                                            onChange={handleChange}
                                            placeholder={input.placeholder}
                                            disabled={input.label.toLowerCase() == "size" ? true : false}
                                        />
                                    </div>
                                )
                            }
                            )}
                        </form>
                        <button className="button" onClick={handleSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>

    );
};

export default Edit;
