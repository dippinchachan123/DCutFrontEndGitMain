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
import { useRequireAuth, useUser } from "../../../context/kapanContext";


const New = () => {
    const ids = useParams().id;
    const [kapanId, cutId, process, packetId] = ids.split("-");
    const [user,setUser] = useUser();
    

    const [data, setData] = useState({ status: "PENDING" });

    const navigate = useNavigate();

    const title = "Add Sub Packet";

    const inputs = [

        {
            id: 3,
            label: "Pieces",
            type: "number",
            placeholder: "10",
        },
        {
            id: 2,
            label: "Weight",
            type: "number",
            placeholder: "100",
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
        Cart.addSPacket(kapanId, cutId, process, packetId, data)
            .then(res => {
                if (res.err) {
                    notificationPopup(res.msg, "error")
                }
                else {
                    notificationPopup(res.msg, "success")
                    navigate(`/Packet/${ids}`);
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
                                onChange={handleChange}
                                style={{ display: "none" }}
                            />
                        </label>
                    </div>
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

export default New;
