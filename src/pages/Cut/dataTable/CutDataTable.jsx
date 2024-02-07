import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "./DatatableFields";
import { Link, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import notificationPopup from "../../../helpers/notifications";
import { errors } from "../../../enums/messages";
import { Cut } from "../../../apis/api.cut";
import { useNavigate } from 'react-router-dom';
import DataTableInfoBox from "../../../components/Shared/DataTableInfo";
import { Kapan } from "../../../apis/api.kapan";
import { useUser } from "../../../context/kapanContext";
import { Main } from "../../../apis/Main";

const Datatable = ({postProcess}) => {
  const [data, setData] = useState([]);
  const [user] = useUser();
  let kapanId = parseInt(useParams().id);
  const navigate = useNavigate();

  let [totalState,setTotalState] = useState({
    totalWeight : 0,
    totalPieces : 0
  })


  const iterateCuts = async (data)=>{
    const newState = {
      totalWeight : 0,
      totalPieces : 0
    }
    for(let i = 0;i < data.length;i++){
        let ele = data[i]
        newState.totalWeight += ele.weight;
        newState.totalPieces += ele.pieces
    }
    setTotalState(newState)
  }


  const handleDelete = (id) => {
    const shouldDelete = window.confirm("Are you sure you want to delete?");
    if (shouldDelete) {
      Cut.deleteCutByID(kapanId,id,postProcess)
        .then(res => {
          if (res.err) {
            notificationPopup(res.msg, "error")
          }
          else {
            notificationPopup(res.msg, "success")
            setData(data.filter((item) => item.id !== id));
          }
        })
        .catch(err => {
          notificationPopup(errors.DELETION_ERROR, "error")
        })
    }
  };


  const handleView = (id) => {
    navigate(`/${postProcess?"PP":""}cuts/${kapanId}-${id}`)
  };


  const handleEdit = (id) => {
    navigate(`/${postProcess?"PP":""}cuts/edit/${kapanId}-${id}`)
  };


  useEffect(() => {
    Cut.getCuts(kapanId,postProcess)
      .then(res => {
        if (!res.err) {
          setData(res.data[0].cuts)
          iterateCuts(res.data[0].cuts)
          notificationPopup(res.msg, "success")
        } else {
          notificationPopup(res.msg, "error")
        }
      })
  }, [])


  const getTableData = (data) => {
    // Create a deep copy of the data array to avoid modifying the original array
    return JSON.parse(JSON.stringify(data));
  };


  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            <div
              className="viewButton"
              onClick={() => handleView(params.row.id)}
            >
              View
            </div>
            {!Main.isStaff(user) && <div
              className="editButton"
              onClick={() => handleEdit(params.row.id)}
            >
              Edit
            </div>}
            {!Main.isStaff(user) && <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>}
          </div>
        );
      },
    },
  ];

  
  return (
    <div className="datatable">
      <div className="datatableTitle">
        {postProcess?"Post Process":"Cuts"}
        {<Link to={`/${postProcess?"PP":""}Cuts/new/${kapanId}`} className="link">
          Add New
        </Link>}
      </div>
      <DataTableInfoBox infoData={[{label : "Weight",value : totalState.totalWeight.toFixed(2)},{label : "Pieces",value : totalState.totalPieces.toFixed(2)}]}/>
      <DataGrid
        className="datagrid"
        rows={getTableData(data)}
        columns={userColumns().concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        disableSelectionOnClick={true}
        checkboxSelection
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default Datatable;