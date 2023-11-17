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
import { User } from "../../../apis/api.user";
import {  useUser } from "../../../context/kapanContext";
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import { Staff } from "../../../apis/api.staff";

const Edit = () => {
    const [data, setData] = useState({});
    const [staffs,setStaffs] = useState([])

    const { id } = useParams()
    const navigate = useNavigate();
    const title = "Edit User"

    const [user, setUser] = useUser();


    let inputs = [
        {
            id: 1,
            label: "Type",
            type: "text",
            placeholder: "Pre-Process",
            inActive: data.role != "Staff" ? true : false,
            defaultValue: data.staff ? data.staff.type || "Pre-Process" : "Pre-Process",
            disable: true
        },
        {
            id: 4,
            label: "Role",
            type: "select",
            options: ["Staff", "Admin", "Super-Admin"]
        },
        {
            id: 1,
            label: "Name",
            type: "text",
            placeholder: "10",
            inActive: data.role == "Staff" ? true : false
        },
        {
            id: 3,
            label: "Number",
            type: "number",
            placeholder: "00000XXXXX",
        },

    ]

    const handleSubmit = (e) => {
        User.editUserByID(id, data)
            .then(res => {
                if (res.err) {
                    notificationPopup(res.msg, "error")
                }
                else {
                    notificationPopup(res.msg, "success")
                    navigate('/users');
                }
            })
            .catch(err => {
                notificationPopup(errors.SAVE_ERROR, "error")
            })
    }

    const handleChange = (e) => {
        const name = e.target.name
        const type = e.target.type;
        const value = type == "number" ? Number(name == "img" ? e.target.files[0] : e.target.value) :
            name == "img" ? e.target.files[0] : e.target.value

        setData({ ...data, [name]: value })
    }
    const handleChangeAutoCompleteBox = (e, v, name) => {
        setData({ ...data, [name]: v })
    }

    useEffect(() => {
        Staff.getStaffs()
            .then(res => {
                console.log("Result", res)
                setStaffs(res.data)
            })
            .catch(err => {
                console.log("Error", err)
                notificationPopup("Error in loading Staff!!", "error")
            })
    }, [])

    useEffect(() => {
        User.getUserByID(id)
            .then(res => {
                if (res.err) {
                    notificationPopup(res.msg, "error")
                }
                else {
                    setData(res.data)
                }
            })
            .catch(err => {
                notificationPopup(errors.SAVE_ERROR, "error")
            })
    }, [])

    const options = (data) => data.map((obj) => {
        const { name, ...rest } = obj; // Destructure the "name" key and store the rest of the object in the "rest" variable
        return { label: name, ...rest }; // Create a new object with "label" and the rest of the properties
    });

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
                            {data.role == "Staff" ? <div className="formInput">
                                <Autocomplete
                                    disablePortal
                                    id="staff"
                                    options={options(staffs)}
                                    sx={{ width: 300 }}
                                    defaultValue={data.staff?.label}
                                    name="staff"
                                    onChange={(e, v) => { handleChangeAutoCompleteBox(e, v, "staff") }}
                                    renderInput={(params) => <TextField {...params} label="Staff" />}
                                />
                            </div> : ""}
                            {inputs.map((input) => {
                                if (input.inActive) {
                                    return
                                }
                                if (input.type == "select") {
                                    return (
                                        <div className="formInput" key={input.id}>
                                            <label htmlFor="selectBox">{input.label}</label>
                                            <select
                                                id={"selectBox" + input.label}
                                                name={input.label.toLowerCase()}
                                                value={data ? data[input.label.toLowerCase()] || input.defaultValue || "" : ""}
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
                                            value={data ? data[input.label.toLowerCase()] || input.defaultValue || "" : ""}
                                            name={input.label.toLowerCase()}
                                            onChange={handleChange}
                                            placeholder={input.placeholder}
                                            disabled={input.label.toLowerCase() == "size" || input.disable ? true : false}
                                        />
                                    </div>
                                )
                            }
                            )}

                        </form>
                        <div className="button" onClick={handleSubmit}>Send</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Edit;
