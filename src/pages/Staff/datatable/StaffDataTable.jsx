import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import notificationPopup from "../../../helpers/notifications";
import { errors } from "../../../enums/messages";
import { useNavigate } from 'react-router-dom';
import DataTableInfoBox from "../../../components/Shared/DataTableInfo";
import { Staff } from "../../../apis/api.staff";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';

const Datatable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const handleDelete = (id) => {
    Staff.deleteStaffByID(id)
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
    navigate(`/staffs/${id}`)
  };

  const handleEdit = (id) => {
    navigate(`/staffs/edit/${id}`)
  };

 
  useEffect(() => {
    Staff.getStaffs()
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

  const getTableData = (data) => {
    // Create a deep copy of the data array to avoid modifying the original array
    return data
  };
  
  const userColumns = [
    { field: "id", headerName: "ID", width: 70 },
    {
      field: "status",
      headerName: "Status",
      width: 150,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.status}`}>
            {params.row.status}
          </div>
        );
      },
    },
    {
      field: "name",
      headerName: "User name",
      width: 400,
      renderCell: (params) => {
        return (
          <div style={{display:'flex',flexDirection:'row',columnGap:'5px',alignItems:'center'}}>
            <div>{params.row.img?<img className="cellImg" src={params.row.img} alt="avatar" />:<AccountCircleIcon />}</div>
            <div>{params.row.name}</div>
          </div>
        );
      },
    },
    {
      field: "number",
      headerName: "Phone No.",
      width: 250,
    },

    {
      field: "type",
      headerName: "Type",
      width: 220,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.type}`}>
            {params.row.type}
          </div>
        );
      },
    }, 

    {
      field: "remarks",
      headerName: "Remarks",
      width: 220,
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
        Staff
        <Link to={`/staffs/new` + ""} className="link">
          Add New
        </Link>
      </div>
      <DataGrid
        className="datagrid"
        rows={getTableData([...data])}
        columns={userColumns.concat(actionColumn)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        checkboxSelection
      />
    </div>
  );
};

export default Datatable;