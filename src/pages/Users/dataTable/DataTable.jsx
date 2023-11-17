import "../../Cart/dataTable/datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import notificationPopup from "../../../helpers/notifications";
import { Cart } from "../../../apis/api.cart";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { errors, success } from "../../../enums/messages";
import IssueForm from "../../Forms/issuePacketForm";
import IssuedPacketForm from "../../Forms/issuePacketOpen";
import SubReturnForm from "../../Forms/returnWeightSubPacket";
import { User } from "../../../apis/api.user";


const Datatable = () => {
  const [data, setData] = useState([]);
  const [rowDetails, setRowDetails] = useState(null);
  const navigate = useNavigate();


  const handleDelete = (id) => {
    User.deleteUserByID(id)
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

  const getTableData = (data) => {
    // Create a deep copy of the data array to avoid modifying the original array4
    return data;
  };

  const handleEdit = (id) => {
    navigate(`/users/edit/${id}`)
  }

  useEffect(() => {
    User.getUsers()
      .then(res => {
        console.log(res)
        if (!res.err) {
          setData(res.data)
          notificationPopup(res.msg, "success")
        } else {
          notificationPopup(res.msg, "error")
        }
      })
  }, [])

  const userColumns = [
    { field: "id", headerName: "SR No.", width: 70 },
    {
      field: "name",
      headerName: "Name",
      width: 200, 
      renderCell : (params) => {
        if(params.row.staff && params.row.role == "Staff"){
          return params.row.staff?.label;
        }else{
          return params.row.name;
        }
      }
    },
    {
      field: "number",
      headerName: "Number",
      width: 200, 
    },
    {
      field: "status",
      headerName: "Status",
      width: 100,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.status}`}>
            {params.row.status}
          </div>
        );
      },
    },
    {
      field: "role",
      headerName: "Role",
      width: 200

    },
    {
      field: "staff",
      headerName: "Type",
      width: 200,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.staff?.type}`}>
            {params.row.staff?.type}
          </div>
        );
      },
    },
  ];

  const actionColumn = [
    {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
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
        Users
        <div>
          <button onClick={() => navigate(`/users/new`)} className="link" style={{ alignSelf: 'right' }}>
            Add New
          </button>
        </div>
      </div>

      <DataGrid
        className="datagrid"
        rows={getTableData(data)}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        disableSelectionOnClick={true}
        checkboxSelection
        onRowClick={(params) => {
          console.log(params.row)
          setRowDetails(params.row)
        }}
        getRowId={(row) => row.id}
      />
    </div>
  );
};

export default Datatable;