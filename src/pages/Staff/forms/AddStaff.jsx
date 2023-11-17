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


const New = ({ postProcess }) => {
    const [data, setData] = useState({ status: "Active" });
    const navigate = useNavigate();
    const [user, setUser] = useUser();
    const title = "Add New Staff"

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

    const handleSubmit = (e) => {
        Staff.addStaff(data)
            .then(res => {
                if (res.err) {
                    notificationPopup(res.msg, "error")
                }
                else {
                    console.log("Staff Added : ", res)
                    notificationPopup(res.msg, "success")
                    navigate('/staffs');
                }
            })
            .catch(err => {
                notificationPopup(errors.SAVE_ERROR, "error")
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
        console.log("Form data : ", data)

        setData({ ...data, [name]: value })
    }

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
                        <button className="button" onClick={handleSubmit}>Send</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default New;
