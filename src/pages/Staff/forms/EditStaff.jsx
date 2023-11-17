import "../../../commonScss/Form.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import React from "react";
import { getSearchComboBoxOptions } from "../../../helpers/functions";
import notificationPopup from "../../../helpers/notifications";
import { errors } from "../../../enums/messages";
import { Cut } from "../../../apis/api.cut";
import { useRequireAuth, useUser } from "../../../context/kapanContext";
import { Staff } from "../../../apis/api.staff";


const Edit = ({ postProcess }) => {
    const [data, setData] = useState({ status: "Active" });
    const navigate = useNavigate();
    const [user, setUser] = useUser();
    const { id } = useParams();

    const title = "Edit Staff"

    const inputs = [
        {
            id: 1,
            label: "Name",
            showLabel: "Name",
            type: "text",
            placeholder: "abc",
        },
        {
            id: 6,
            label: "Status",
            showLabel: "Status",
            type: "select",
            placeholder: "Status",
            options: ["Active", "Non-Active"]
        },
        {
            id: 5,
            label: "Type",
            showLabel: "Type",
            type: "select",
            placeholder: "Remarks",
            options: ["Pre-Process", "Post-Process"]

        },
        {
            id: 5,
            label: "Remarks",
            showLabel: "Remarks",
            type: "text",
            placeholder: "Remarks",
        },
        

    ];

    const handleSubmit = (e, id, data, setData, navigate) => {
        Staff.editStaffByID(id, data)
            .then(res => {
                console.log("updating staff : ", res)
                if (res.err) {
                    notificationPopup(res.msg, "error")
                }
                else {
                    notificationPopup(res.msg, "success")
                    navigate('/staffs');
                }
            })
            .catch(err => {
                notificationPopup(errors.UPDATE_ERROR, "error")
            })
    }

    const handleChange = (e, data, setData) => {
        const name = e.target.name
        const type = e.target.type;
        let value = null
        if (type == "select") {
            value = e.target.value
        } else {
            value = type == "number" ? Number(name == "img" ? e.target.files[0] : e.target.value) :
                name == "img" ? e.target.files[0] : e.target.value
        }
        setData({ ...data, [name]: value })
    }

    useEffect(() => {
        Staff.getStaffByID(id)
            .then(res => {
                if (!res.err) {
                    setData(res.data)
                }
            })
            .catch(err => {
                console.log("ERROR : ", err)
            })
        
    }, [])



    return (
        <div className="new">
            <Sidebar />
            <div className="newContainer">
                <Navbar />
                <div className="top">
                    <h1>{title}</h1>
                </div>
                <div className="bottom">
                    <div className="left">
                        <label htmlFor="file">
                            <img
                                src={
                                    data?.img
                                        ? URL.createObjectURL(data?.img)
                                        : "https://icon-library.com/images/no-image-icon/no-image-icon-0.jpg"
                                }
                                alt=""
                            />
                            {/* <DriveFolderUploadOutlinedIcon className="icon" /> */}
                            <input className="imageInput"
                                name="img"
                                type="file"
                                id="file"
                                onChange={(e) => handleChange(e, data, setData)}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>

                    <div className="right">
                        <form className="formInput">
                            {inputs.map((input) => {
                                if (input.type != "select") {
                                    return (
                                        <div className="formInput" key={input.id}>
                                            <label>{input.showLabel}</label>
                                            <input
                                                type={input.type}
                                                value={data ? data[input.label.toLowerCase()] : ""}
                                                name={input.label.toLowerCase()}
                                                onChange={(e) => handleChange(e, data, setData)}
                                                placeholder={input.placeholder} />
                                        </div>
                                    )
                                }
                                else {
                                    return (
                                        <div className="formInput" key={input.id}>
                                            <label>{input.showLabel}</label>
                                            <select
                                                type={input.type}
                                                value={data ? data[input.label.toLowerCase()] : ""}
                                                name={input.label.toLowerCase()}
                                                onChange={(e) => handleChange(e, data, setData)}
                                                isSearchable={true}
                                                placeholder={input.placeholder}
                                            >
                                                {getSearchComboBoxOptions(input.options)}
                                            </select>

                                        </div>
                                    )
                                }
                            })}

                        </form>
                        <button className="button" onClick={(e) => handleSubmit(e, id, data, setData, navigate)}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );


};

export default Edit;
