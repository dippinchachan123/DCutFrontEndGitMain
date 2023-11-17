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

const Datatable = ({postProcess}) => {
  const [data, setData] = useState([]);
  let kapanId = parseInt(useParams().id);
  if(postProcess){
    kapanId = 1
  }
  const navigate = useNavigate();

  const handleDelete = (id) => {
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
            <div
              className="editButton"
              onClick={() => handleEdit(params.row.id)}
            >
              Edit
            </div>
            <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>
          </div>
        );
      },
    },
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        {postProcess?"Post Process":"Cuts"}
        <Link to={`/${postProcess?"PP":""}Cuts/new/${kapanId}`} className="link">
          Add New
        </Link>
      </div>
      <DataTableInfoBox infoData={[{label : "Weight",value : 100},{label : "Pieces",value : 100}]}/>
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