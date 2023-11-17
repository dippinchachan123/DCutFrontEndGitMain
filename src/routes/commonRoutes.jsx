import Home from "../pages/home/Home";
import Login from "../pages/Login/loginPage";

//kapans
import KapanMainPage from '../pages/Kapan/Main'
import KapanOpenView from "../pages/Kapan/openView/KapanOpenView";
import NewkapanForm from "../pages/Kapan/forms/AddKapan";
import EditkapanForm from "../pages/Kapan/forms/EditKapan";

//Staff
import StaffMainPage from "../pages/Staff/Main";
import NewStaff from "../pages/Staff/forms/AddStaff";
import EditStaff from "../pages/Staff/forms/EditStaff";
//cuts
import CutOpenView from "../pages/Cut/openView/CutOpenView";
import NewCutForm from "../pages/Cut/forms/AddCut";
import EditCutForm from "../pages/Cut/forms/EditCut";

//Carts
import CartOpenView from "../pages/Cart/openView/CartOpenView";
import NewCartForm from "../pages/Cart/forms/AddPacket";
import EditCartForm from "../pages/Cart/forms/EditPacket";

//Packets
import PacketOpenView from "../pages/Packet/openView/PacketOpenView";
import NewSPacketForm from "../pages/Packet/forms/AddPacket";
import EditSPacketForm from "../pages/Packet/forms/EditPacket";


//Users
import Users from "../pages/Users/openView/PacketOpenView";
import NewUserForm from "../pages/Users/forms/AddPacket";
import EditUserForm from "../pages/Users/forms/EditPacket";

import { Route, Routes } from "react-router-dom";
import { ProtectedRoute, useUser } from "../context/kapanContext";


export const GlobalRoute = () => {
    const user = JSON.parse(localStorage.getItem('user'))
    return (
        <Routes>
            <Route path="/">
                <Route path="home" element={<Home />} />
                <Route index element={<Login />} />
                <Route path="kapans">
                    <Route index element={
                        <KapanMainPage />
                    } />
                    <Route path=":id" element={
                        <KapanOpenView />
                    } />
                    <Route
                        path="new"
                        element={<NewkapanForm />}
                    />
                    <Route
                        path="edit/:id"
                        element={<EditkapanForm />}
                    />
                </Route>
                <Route path="Cuts">
                    <Route path=":id" element={
                        <CutOpenView />
                    } />
                    <Route
                        path="new/:id"
                        element={<NewCutForm />}
                    />
                    <Route
                        path="edit/:id"
                        element={<EditCutForm />}
                    />
                </Route>
                <Route path="Cart">

                    <Route path=":id" element={<CartOpenView />} />
                    <Route path="New/:id" element = {<NewCartForm />}/>
                    <Route
                        path="Edit/:id"
                        element={<EditCartForm />}
                    />
                </Route>
                <Route path="Packet">
                    <Route path=":id" element={<PacketOpenView />} />
                    <Route path="New/:id" element = {<NewSPacketForm />}/>
                    <Route
                        path="Edit/:id"
                        element={<EditSPacketForm />}
                    />
                </Route>
                <Route path="staffs">
                    <Route index element={
                        <StaffMainPage />
                    } />
                    <Route
                        path="new"
                        element={<NewStaff />}
                    />

                    <Route
                        path="edit/:id"
                        element={<EditStaff />}
                    />
                </Route>
                <Route path="users">
                    <Route index element={
                        <Users />
                    } />
                    <Route
                        path="new"
                        element={<NewUserForm />}
                    />

                    <Route
                        path="edit/:id"
                        element={<EditUserForm />}
                    />
                </Route>
                <Route path="PPkapans">
                    <Route path=":id" element={
                        <KapanOpenView postProcess={true}/>
                    } />
                </Route>

                <Route path="PPcuts">
                    <Route path=":id" element={
                        <CutOpenView postProcess={true}/>
                    } />
                    <Route
                        path="new/:id"
                        element={<NewCutForm postProcess={true}/>}
                    />
                    <Route
                        path="edit/:id"
                        element={<EditCutForm postProcess={true}/>}
                    />
                </Route>

                <Route path="PPcart">
                    <Route path=":id" element={<CartOpenView postProcess={true}/>} />
                    <Route path="New/:id" element = {<NewCartForm postProcess={true}/>}/>
                    <Route
                        path="Edit/:id"
                        element={<EditCartForm postProcess={true}/>}
                    />
                </Route>

                <Route path="PPstaffs">
                    <Route index element={
                        <StaffMainPage postProcess={true}/>
                    } />
                    <Route
                        path="new"
                        element={<NewStaff />}
                    />

                    <Route
                        path="edit/:id"
                        element={<EditStaff />}
                    />
                </Route>

            </Route>
        </Routes>
    )
}
