import "./datatable.scss";
import { DataGrid } from "@mui/x-data-grid";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import notificationPopup from "../../../helpers/notifications";
import { Cart } from "../../../apis/api.cart";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ReturnForm from "../../Forms/returnWeight";
import { POST_PROCESS_TYPES, POST_PROCESS_TYPES_Keys, PRE_PROCESS_TYPES, returnWeights, returnWeightsPP } from "../../../enums/processes";
import { errors, success } from "../../../enums/messages";
import IssueForm from "../../Forms/issuePacketForm";
import IssuedPacketForm from "../../Forms/issuePacketOpen";
import BoilReturnForm from "../../Forms/returnWeightSubPacket";
import { generateIssuePdf } from "../../../components/PDFs/issuePacketsPdf";
import jsPDF from "jspdf";
import 'jspdf-autotable';
import { Kapan } from "../../../apis/api.kapan";
import { config } from "../../../config";
import { generatePrintPdf } from "../../../components/PDFs/printPackets";
import { Main } from "../../../apis/Main";
import { useUser } from "../../../context/kapanContext";


const Datatable = ({ ids,postProcess }) => {
  const [data, setData] = useState([]);
  const [selectedRowIds, setSelectedRowIds] = useState(new Set());
  const [user] = useUser();
  const [kapanId, cutId, process] = ids.split("-").map(ele => {
    if (!isNaN(ele)) {
      return parseInt(ele)
    } return ele
  })

  const [lock,setLock] = useState({status : true,byApi : false});
  const [RTFormVisibility, setRTFormVisibility] = useState(false);
  const [BoilFormVisibility, setBoilFormVisibility] = useState(false);
  const [IssueFormVisibility, setIssueFormVisibility] = useState(false);
  const [IssuedPacketVisibility, setIssuedPacketVisibility] = useState(false);
  const [rowDetails, setRowDetails] = useState(null);
  const navigate = useNavigate();

  const handleDelete = (id) => {
    Cart.deletePacket(kapanId, cutId, process, id,postProcess)
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

  const handleView = (id) => {
    navigate(`/Packet/${ids}-${id}`)
  };

  const handleEdit = (id) => {
    navigate(`/${postProcess?"PP":""}Cart/Edit/${ids}-${id}`)
  }

  const toggleRTForm = (e,issue,boil,isReturn) => {
    if(process == PRE_PROCESS_TYPES.LASER_LOTING){
      isReturn?.returnWeight || boil || RTFormVisibility?setRTFormVisibility(!RTFormVisibility):notificationPopup("Boil Packet First!!","error")
    }else{
      isReturn || issue || RTFormVisibility ?setRTFormVisibility(!RTFormVisibility):notificationPopup("Issue Packet First!!","error")
    }
  }

  const toggleBoilForm = (e,isAllRtrn,isBoil) => {
    if(isAllRtrn || BoilFormVisibility || process != PRE_PROCESS_TYPES.LASER_LOTING || isBoil){
        setBoilFormVisibility(!BoilFormVisibility)
    }else{
      notificationPopup("Return All SubPacket First!!","error")
    }
  }

  const toggleISForm = (e) => {
    setIssueFormVisibility(!IssueFormVisibility)
  }
  const toggleIssuedPacketForm = (e) => {
    setIssuedPacketVisibility(!IssuedPacketVisibility)
  }

  const handleSubmitRTForm = (e, formData, id, dlt = false) => {
    Cart.returnMainPacket(kapanId, cutId, process, id, dlt ? { weights: null, returnWeight: 0 } : formData,postProcess)
      .then(res => {
        if (res.err) {
          notificationPopup(res.msg, "error")
        }
        else {
          Cart.editPacketField(kapanId, cutId, process, id, "loss", { loss: (!dlt) ? rowDetails.weight - formData.returnWeight : 0 },postProcess)
            .then(res => {
              if (res.err) {
                console.log("Error :",res)
                notificationPopup("Update Successfull!!(Return Weight not changed.)", "success")
              }
              else {
                toggleRTForm();
                notificationPopup(success.UPDATE_SUCCESS, "success")
              }
            })
            .catch(err => {
              notificationPopup(errors.UPDATE_ERROR, "error")
            })
        }
      })
      .catch(err => {
        notificationPopup(errors.UPDATE_ERROR, "error")
      })
  }

  const handleSubmitBoilForm = (e, formData, id, dlt = false) => {
    Cart.editPacketField(kapanId, cutId, process, id, "boil", { boil: dlt ? null : formData },postProcess)
      .then(res => {
        if (res.err) {
          notificationPopup(res.msg, "error")
        }

      })
      .catch(err => {
        notificationPopup(errors.UPDATE_ERROR, "error")
      })
    toggleBoilForm();
  }

  const downloadPdf = async (data,to) => {
    const pdf = new jsPDF();
    const processName = (postProcess?POST_PROCESS_TYPES[process]:process).replaceAll("_"," ")
    await generateIssuePdf(pdf,{data,to,kapanId,cutId,process : processName});
    pdf.save(`issuePacketsTo${to.split('-')[1]}.pdf`);
  };

  const handleSubmitIssueForm = (e, packets, dlt = false) => {
    packets.packets.length && packets.packets.forEach(packet => {
      Cart.editPacketField(kapanId, cutId, process, packet.id, "issue", { issue: packets.user },postProcess)
        .then(res => {
          if (res.err) {
            notificationPopup(res.msg,"error")
            console.log("Error", res)
          }
          else {
            setSelectedRowIds(new Set())
          }
        })
    })
    toggleISForm()
    downloadPdf(packets.packets,packets.user)
  }

  async function printPackets(data){
    const pdf = new jsPDF('l', 'mm', [400, 200]);
    pdf.setFont("Calibri", "bold");
    pdf.setFontSize(14);
    pdf.setTextColor(14, 3, 64);    
    const processName = (postProcess?POST_PROCESS_TYPES[process]:process).replaceAll("_"," ")
    data = data.map((ele)=>{
        ele.url = `${config.FRONTEND_DOMAIN}/${postProcess?"PPcart":"cart"}/${kapanId}-${cutId}-${process}`
        return ele;
    })
    await generatePrintPdf(pdf,{data,kapanId,cutId,process : processName});
    pdf.save(`printPackets.pdf`);
    setSelectedRowIds(new Set())
  }

  const handleUnSubmitIssueForm = (e, id) => {
    Cart.editPacketField(kapanId, cutId, process, id, "issue", { issue: null },postProcess)
      .then(res => {
        if (res.err) {
          // notificationPopup(errors.UPDATE_ERROR,"error")
          console.log("Error", res.err)
          notificationPopup(errors.UPDATE_ERROR, "error")

          
        }
        else {
          toggleIssuedPacketForm()
          handleSubmitRTForm(null,{},id,true)
          .then(res => {
            if(!res.err){
              notificationPopup(success.UPDATE_SUCCESS, "success")
            }
          })

          setSelectedRowIds(new Set())
        }
      })
  }

  const selectedEntries = (ids) => {
    const res = Array.from(ids).length != 0 && Array.from(ids).map((rowId) => data.find((row) => row.id === rowId));
    return res
  }
  
  useEffect(() => {
    Cart.getPackets(parseInt(kapanId), parseInt(cutId), process,postProcess)
      .then(res => {
        if (!res.err) {
          setData(res.data[0].packets)
        }
        else {
          notificationPopup(res.msg, "error")
        }
      })
      .catch(err => {
        notificationPopup(err, "error")
      })
  }, [ids, RTFormVisibility, IssueFormVisibility, IssuedPacketVisibility, BoilFormVisibility])

  useEffect(()=>{
    Kapan.getKapanByID(kapanId)
    .then(res => {
        console.log(res)
        setLock({status : res.data[0].lock.status})
        if(!res.data[0].lock.status){
          console.log("Set Timer...")

          const TimerID = setInterval(() => {
              console.log("Locking....")
              setLock({status : true})
              clearInterval(TimerID)
          },config.UnlockTime)
        }
    })
    .catch(err => {
      console.log("Error in fetching Lock Field of kapan : ",err)
    })
  },[])

  const userColumns1 = [
    { field: "id", headerName: "P No.", width: 70 },
    {
      field: "status",
      headerName: "Status",
      width: 111,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus ${params.row.status}`}>
            {params.row.status}
          </div>
        );
      },
    },
    {
      field: "pieces",
      headerName: "Pieces",
      width: 100

    },
    {
      field: "weight",
      headerName: "Weight",
      width: process == PRE_PROCESS_TYPES.LASER_LOTING ? 200 : 100,
      renderCell: (params) => {
        return process == PRE_PROCESS_TYPES.LASER_LOTING ?
          (<div>
            <span>{(params.row.weight - params.row.subPacketsDetails.totalWeightIn).toFixed(2)}</span>
            <span style={
              {
                marginLeft: '50px',
                'background-color': 'rgba(255, 0, 0, 0.05)',
                'color': 'crimson',
                'fontSize': '16px'
              }}>
              /{params.row.weight}
            </span>
          </div>) : params.row.weight
      }

    },
    {
      field: "size",
      headerName: "Size",
      width: 100
  }]

  let inBTWColumns = []
  
  if(!postProcess){
    switch (process) {
      case PRE_PROCESS_TYPES.POLISH_LOTING:
        inBTWColumns = [
          {
            field: "purityno",
            headerName: "Purity No.",
            width: 100,
          },
          {
            field: "boilWeight",
            headerName: "LaserWgt",
            width: 100,
            renderCell: (params) => {
              return params.row.boil?.weight;
            }
          },
          {
            field: "boilPieces",
            headerName: "LaserPcs",
            width: 100,
            renderCell: (params) => {
              return params.row.boil?.pieces;
            }
          },
          {
            field: "boil",
            headerName: "Laser",
            width: 100,
            renderCell: (params) => {
              if (!params.row.boil) {
                return (
                  <button className='return cancel' onClick={(e) => toggleBoilForm(e,params.row.subPacketsDetails.isAllReturn,params.row.boil)}>
                    <div style={{ padding: '5px' }} ><CancelIcon /></div>
                  </button>
                )
              }
              else {
                return (<button className='return check' onClick={(e) => toggleBoilForm(e,params.row.subPacketsDetails.isAllReturn,params.row.boil)}>
                  {<div ><CheckCircleIcon />
                  </div>}
                </button>)
              }
            }
          },
          {
            field: "charni",
            headerName: "Charni",
            width: 100,
            renderCell: (params) => {
              return params.row.charni?.value;
            }
          },
          {
            field: "color",
            headerName: "Color1/Pcs",
            width: 150,
            renderCell: (params) => {
              return params.row.color?
              <span>{params.row.color?.value} / {params.row.colorPieces1}</span>:
              'Not Available';
            }
          },
          {
            field: "color2",
            headerName: "Color2/Pcs",
            width: 150,
            renderCell: (params) => {
              return params.row.color2?
              <span>{params.row.color2?.value} / {params.row.colorPieces2}</span>:
              'Not Available';
            }
          },
          {
            field: "color3",
            headerName: "Color3/Pcs",
            width: 150,
            renderCell: (params) => {
              return params.row.color3?
              <span>{params.row.color3?.value} / {params.row.colorPieces3}</span>:
              'Not Available';
            }
          },
          {
            field: "cutting",
            headerName: "Cutting",
            width: 100,
            renderCell: (params) => {
              return params.row.cutting?.value;
            }
  
          }
        ];
        break;
      case PRE_PROCESS_TYPES.POLISH_TABLE_LOTING:
        inBTWColumns = [
          {
            field: "charni",
            headerName: "Charni",
            width: 100,
            renderCell: (params) => {
              return params.row.charni?.value;
            }
          },
          {
            field: "color",
            headerName: "Color/Pcs",
            width: 150,
            renderCell: (params) => {
              return params.row.color?
              <span>{params.row.color?.value} / {params.row.colorPieces1}</span>:
              'Not Available';
            }
          },
        ]
        break;
      case PRE_PROCESS_TYPES.GHAT_LOTING:
        inBTWColumns = [
          {
            field: "charni",
            headerName: "Charni",
            width: 100,
            renderCell: (params) => {
              return params.row.charni?.value;
            }
          }
        ]
        break;
      
      case PRE_PROCESS_TYPES.LASER_LOTING:
        inBTWColumns = [
          {
            field: "subReturnWeight",
            headerName: "SubRWgt",
            width: 100,
            renderCell: (params) => {
              return params.row.subPacketsDetails?.subReturnWeight;
            }
          },
          {
            field: "subReturnPieces",
            headerName: "SubRPcs",
            width: 100,
            renderCell: (params) => {
              return params.row.subPacketsDetails?.subReturnPieces;
            }
          },
          {
            field: "boilWeight",
            headerName: "BoilWgt",
            width: 100,
            renderCell: (params) => {
              return params.row.boil?.weight;
            }
          },
          {
            field: "boilPieces",
            headerName: "BoilPcs",
            width: 100,
            renderCell: (params) => {
              return params.row.boil?.pieces;
            }
          },
          {
            field: "boil",
            headerName: "Boil",
            width: 100,
            renderCell: (params) => {
              if (!params.row.boil) {
                return (
                  <button className='return cancel' onClick={(e) => toggleBoilForm(e,params.row.subPacketsDetails.isAllReturn,params.row.boil)}>
                    <div style={{ padding: '5px' }} ><CancelIcon /></div>
                  </button>
                )
              }
              else {
                return (<button className='return check' onClick={(e) => toggleBoilForm(e,params.row.subPacketsDetails.isAllReturn,params.row.boil)}>
                  {<div style={{ display: "flex", flexDirection: "row", padding: '5px', columnGap: '5px', alignItems: 'centre' }}><CheckCircleIcon />
                    <h3 style={{ alignSelf: 'center' }}>{params.row.issue?.split("-")[1]}</h3></div>}
                </button>)
              }
            }
          },
        ]
        break;
    }
  }
  
  const userColumns2 = [{
    field: "returnPieces",
    headerName: "RPcs",
    width: 100,
    renderCell: (params) => {
      return params.row.return?.returnPieces
    }

  },
  {
    field: "returnWeight",
    headerName: "RWgt",
    width: 100,
    renderCell: (params) => {
      return params.row.return?.returnWeight
    }
  },


  {
    field: "loss",
    headerName: "Loss(%)",
    width: 110,
    renderCell: (params) => {
      return (
        <div >
          {`${params.row.loss} (${(params.row.loss / params.row.weight * 100).toFixed(2)}%)`}
        </div>
      );
    },
  },

  {
    field: "return",
    headerName: "Return",
    width: 100,
    renderCell: (params) => {
      if (!params.row.return?.returnWeight) {
        return (
          <button className='return cancel' onClick={(e) => toggleRTForm(e,params.row.issue, params.row.boil, params.row.return?.returnWeight)}>
            <CancelIcon />
          </button>
        )
      }
      else {
        return (
          <button className='return check' onClick={(e) => toggleRTForm(e,params.row.issue, params.row.boil, params.row.return?.returnWeight)}>
            <CheckCircleIcon />
          </button>)
      }
    }
  },
  ];
  
  function filterFields(columns){
      const p = PRE_PROCESS_TYPES
      if([p.ORIGINAL_RC,p.POLISHED,p.RC,p.REJECTION].includes(process)){
          columns.filter(ele => {
            if(["returnPieces","returnWeight","loss","return","issued"].includes(ele.field)){
              return false
            }
            return true
          })
          console.log("c",columns)
          return columns.map(ele => {
              console.log("Dd",ele)
              ele.width = (ele.width || 150) + 60
              return ele
          })
      }
      return columns
  }
  console.log(postProcess,lock,process)

  const actionColumn = [
    ((postProcess && Main.lockForStaff(user,lock)) || (process != PRE_PROCESS_TYPES.LASER_LOTING && (Main.lockForStaff(user,lock))))? {} : {
      field: "action",
      headerName: "Action",
      width: 200,
      renderCell: (params) => {
        return (
          <div className="cellAction">
            {process == PRE_PROCESS_TYPES.LASER_LOTING ? <div
              className="viewButton"
              onClick={() => handleView(params.row.id)}
            >
              View
            </div> : ""}

            {!(Main.lockForStaff(user,lock)) && <div
              className="editButton"
              onClick={() => handleEdit(params.row.id)}
            >
              Edit
            </div>}

            {!(Main.lockForStaff(user,lock)) && <div
              className="deleteButton"
              onClick={() => handleDelete(params.row.id)}
            >
              Delete
            </div>}
          </div>
        );
      },
    },

    process != PRE_PROCESS_TYPES.LASER_LOTING ? {
      field: "issued",
      headerName: "Issued To",
      width: 400,
      renderCell: (params) => {
        if (!params.row.issue) {
          return (
            <button className='return cancel' onClick={(e) => toggleIssuedPacketForm(e)}>
              <div style={{ padding: '5px' }} ><CancelIcon /></div>
            </button>
          )
        }
        else {
          console.log("Issued row : ", params.row.issue)
          return (<button className='return check' onClick={(e) => toggleIssuedPacketForm(e)}>
            {<div style={{ display: "flex", flexDirection: "row", padding: '5px', columnGap: '5px', alignItems: 'centre' }}><CheckCircleIcon />
              <h3 style={{ alignSelf: 'center' }}>{params.row.issue?.split("-")[1]}</h3></div>}
          </button>)
        }
      }
    } : {},

    {
      field: "remarks",
      headerName: "Remarks",
      width: 250,
      renderCell: (params) => {
        return (
          <div className={`cellWithStatus PENDING`}>
            {params.row.remarks}
          </div>
        )
      }
    },
  ];

  const userColumns = userColumns1.concat(inBTWColumns).concat(userColumns2).concat(actionColumn)

  const getWeightsForForm = (data) => {
    return rowDetails.return ? { ...data, ...rowDetails.return.weights } : data
  }

  return (
    <div className="datatable">
      <div className="datatableTitle">
        Packets<h5>{(postProcess?POST_PROCESS_TYPES[process]:process).replaceAll("_", " ")}</h5>
        <div>
          {!Main.isStaff(user) && <button onClick={(e) => printPackets(selectedEntries(selectedRowIds))} className="link" style={{ alignSelf: 'right' ,marginRight : '25px',width : '70px'}}>
            Print
          </button>}
          {process != PRE_PROCESS_TYPES.LASER_LOTING && !Main.isStaff(user)?<button onClick={(e) => toggleISForm()} className="link" style={{ marginRight: '25px' }}>
            Issue Packets
          </button>:""}
          <button onClick={() => navigate(`/${postProcess?"PP":""}Cart/New/${ids}`)} className="link" style={{ alignSelf: 'right' }}>
            Add New
          </button>
        </div>
      </div>
      {RTFormVisibility &&
        <ReturnForm 
          headerDetails={
            {
              weight: process == PRE_PROCESS_TYPES.LASER_LOTING?rowDetails.boil?.weight || 0:rowDetails.weight, 
              pieces: process == PRE_PROCESS_TYPES.LASER_LOTING?rowDetails.boil?.pieces || 0:rowDetails.pieces, 
              WeightLable : process == PRE_PROCESS_TYPES.LASER_LOTING?"Boil Weight":"Weight" ,
              PiecesLable : process == PRE_PROCESS_TYPES.LASER_LOTING?"Boil Pieces":"Pieces" ,
              packetID: rowDetails.packetId, 
              id: rowDetails.id 
            }
          }
          weights={getWeightsForForm(postProcess?returnWeightsPP[process]:returnWeights[process])} 
          onClose={toggleRTForm} 
          onSubmission={handleSubmitRTForm} 
          postProcess={postProcess}
          />}


      {BoilFormVisibility && <BoilReturnForm headerDetails={
        {
          weight: process == PRE_PROCESS_TYPES.LASER_LOTING ? rowDetails.subPacketsDetails?.subReturnWeight : rowDetails.weight,
          packetID: rowDetails.packetId,
          pieces: process == PRE_PROCESS_TYPES.LASER_LOTING ? rowDetails.subPacketsDetails?.subReturnPieces : rowDetails.pieces,
          id: rowDetails.id
        }
      }
        weights={rowDetails.boil} onClose={toggleBoilForm} onSubmission={handleSubmitBoilForm} />}


      {IssueFormVisibility &&
        <IssueForm headerDetails={{ kapanId: kapanId, cutId: cutId }} PacketsData={selectedEntries(selectedRowIds)} onClose={toggleISForm} onSubmit={handleSubmitIssueForm} postProcess={postProcess}/>}
      {IssuedPacketVisibility && rowDetails.issue &&
        <IssuedPacketForm headerDetails={{ kapanId: kapanId, cutId: cutId, id: rowDetails.id }} StaffData={rowDetails.issue} onClose={toggleIssuedPacketForm} onSubmit={handleUnSubmitIssueForm} postProcess={postProcess}/>}

      <DataGrid
        className="datagrid"
        rows={getTableData(data)}
        columns={filterFields(userColumns)}
        pageSize={9}
        rowsPerPageOptions={[9]}
        disableSelectionOnClick={true}
        checkboxSelection
        onRowClick={(params) => {
          setRowDetails(params.row)
        }}
        getRowId={(row) => row.id}
        selectionModel={Array.from(selectedRowIds)} // Convert the Set to an Array
        onSelectionModelChange={(newSelection) => {
          setSelectedRowIds(new Set(newSelection));
        }}
      />
    </div>
  );
};

export default Datatable;