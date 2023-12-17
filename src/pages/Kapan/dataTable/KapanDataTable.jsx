import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { userColumns } from "./DatatableFields";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { deleteKapanByID, getKapans } from "../../../apis/api.kapan";
import notificationPopup from "../../../helpers/notifications";
import { errors } from "../../../enums/messages";
import { Kapan } from "../../../apis/api.kapan";
import { Cut } from "../../../apis/api.cut";
import { useKapan, useUser } from "../../../context/kapanContext";
import { useNavigate } from 'react-router-dom';
import DataTableInfoBox from "../../../components/Shared/DataTableInfo";
import { Main } from "../../../apis/Main";
import LockIcon from '@mui/icons-material/Lock';
import LockOpenIcon from '@mui/icons-material/LockOpen';
import { config } from "../../../config";


const Datatable = () => {
  const [data, setData] = useState([]);
  const navigate = useNavigate();
  const [user] = useUser();
  const [reload, setReload] = useState(0);


  //Totals
  let [totalState, setTotalState] = useState({
    totalWeight: 0,
    totalPieces: 0
  })

  const handleDelete = (id) => {
    Kapan.deleteKapanByID(id)
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

  const handleLock = (id, lock) => {
    const lockStatus = lock.status;
    if (Main.isStaff(user)) {
      return
    }
    Kapan.editKapanFieldByID(id, "lock",
      {
        "lock":
        {
          status: !lock.status,
          lockedBy: user
        }
      })
      .then(res => {
        if (res.err) {
          console.log("error : ", res.data)
          notificationPopup(res.msg, "error")
        }
        else {
          notificationPopup(lock.status ? "Kapan Unlocked!!" : "Kapan Locked!!", "success")
          setData(data.map(ele => {
            if (ele.id == id) {
              ele.lock.status = !ele.lock.status
            }
            return ele
          }))
          // Locking in frontEnd!!
          // if (lockStatus) {
          //   const timerId = setInterval(() => {
          //     handleLock(id, !lock);
          //     clearInterval(timerId)
          //   }, config.UnlockTime)
          // }
        }
      })
      .catch(err => {
        console.log("error : ", err)
        notificationPopup(errors.UPDATE_ERROR, "error")
      })
  };

  const lockKapan = (id) => {

    Kapan.editKapanFieldByID(id, "lock",
      {
        "lock":
        {
          status: true,
          lockedBy: null
        }
      })
      .then(res => {
        if (res.err) {
          console.log("error : ", res.data)
          notificationPopup(res.msg, "error")
        }
        else {
          setData(data.map(ele => {
            if (ele.id == id) {
              ele.lock.status = false
            }
            return ele
          }))
        }
      })
      .catch(err => {
        console.log("error : ", err)
        notificationPopup(errors.UPDATE_ERROR, "error")
      })
  };


  const handleView = (id) => {
    navigate(`/kapans/${id}`)
  };

  const handleEdit = (id) => {
    navigate(`/kapans/edit/${id}`)
  };

  const iterateKapans = async (data) => {
    const newState = {
      totalWeight: 0,
      totalPieces: 0
    }
    console.log(data)
    for (let i = 0; i < data.length; i++) {
      let ele = data[i]
      newState.totalWeight += ele.weight;
      newState.totalPieces += ele.pieces
    }
    setTotalState(newState)
  }


  useEffect(() => {
    Kapan.getKapans()
      .then(res => {
        if (!res.err) {
          setData(res.data)
          iterateKapans(res.data)
          notificationPopup(res.msg, "success")
        } else {
          notificationPopup(res.msg, "error")
        }
      })
  }, [reload])

  const getTableData = (data) => {
    // Create a deep copy of the data array to avoid modifying the original array
    return data;
  }

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
    {
      field: "lock",
      headerName: "Lock",
      width: 50,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {<div
              className="deleteButton"
              onClick={() => handleLock(params.row.id, params.row.lock)}
            >
              {params.row.lock.status ? <LockIcon /> : <LockOpenIcon />}
            </div>}
          </div>
        );
      },
    }
  ];

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Kapans
        {<Link to={`/kapans/new` + ""} className="link">
          Add New
        </Link>}
      </div>
      <DataTableInfoBox infoData={[{ label: "Weight", value: totalState.totalWeight }, { label: "Pieces", value: totalState.totalPieces }]} />
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