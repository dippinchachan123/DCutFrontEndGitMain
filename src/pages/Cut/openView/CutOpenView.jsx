import "./CutOpenView.scss";
import Sidebar from "../../../components/sidebar/Sidebar";
import Navbar from "../../../components/navbar/Navbar";
import Processes from "../../Process/processTable";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { PRE_PROCESS_TYPES } from "../../../enums/processes";
import TransferWeightForm from "../../Forms/transferWeightForm";
import LocalGroceryStoreIcon from '@mui/icons-material/DriveFileMove';
import ArrowRightAltIcon from '@mui/icons-material/ArrowRightAlt';
import { Cart } from "../../../apis/api.cart";
import notificationPopup from "../../../helpers/notifications";
import { errors } from "../../../enums/messages";
import { useRequireAuth, useUser } from "../../../context/kapanContext";


const Single = ({postProcess}) => {
  let [kapanId, cutId] = useParams().id.split("-").map(ele => parseInt(ele));
  if(postProcess){
    kapanId = 1
  }
  const [showTWForm, setTWFormState] = useState({ visibility: false, source: null });
  const [data, setData] = useState({})
  const navigate = useNavigate();

  const [user,setUser] = useUser();
  

  const [loadCarts, setLoadCarts] = useState(false);

  const toggleForm = (e, source) => {
    setTWFormState({ visibility: !showTWForm.visibility, source: source });
  }

  const handleSubmit = (e, data) => {
    const body = {
      sink: data.sink,
      source: data.source,
      weight: data.weight
    }
    Cart.weightTransfer(kapanId, cutId, body,postProcess)
      .then(res => {
        if (res.err) {
          notificationPopup(res.msg, "error")
        }
        else {
          notificationPopup(res.msg, "success")
          toggleForm(e)
          setLoadCarts(!loadCarts)
          navigate(`/${postProcess?"PP":""}cuts/${kapanId}-${cutId}`);
        }
      })
      .catch(err => {
        notificationPopup(errors.UPDATE_ERROR, "error")
      })
  }

  function parseData(data) {
    const returnedWeight = {}
    console.log(data)
    data.forEach(element => {
      if (PRE_PROCESS_TYPES[element.cart.k]) {
        Object.keys(element.cart.v.packetsDetails.totalReturnWeights).forEach(pro => {
          if (PRE_PROCESS_TYPES[element.cart.k]) {
            returnedWeight[pro] = (returnedWeight[pro] ? returnedWeight[pro] : 0) + element.cart.v.packetsDetails.totalReturnWeights[pro]
          }
        })
      }
    });
    const processes = {}
    data.forEach(element => {
      if (PRE_PROCESS_TYPES[element.cart.k]) {
        processes[element.cart.k] =
        {
          weight: element.cart.v.pending.weight,
          loss: element.cart.v.packetsDetails.totalLoss,
          PacketsWeight: element.cart.v.packetsDetails.totalWeightIn,
          PacketsWeightActual: element.cart.v.packetsDetails.totalWeightInActual,
          returnWeight: returnedWeight[element.cart.k]
        }
      }
    });
    console.log("Processes : ", processes)
    return processes
  }

  const handleCartOpen = (e, process) => {
    navigate(`/${postProcess?"PP":""}Cart/${kapanId}-${cutId}-${process}`)
  }

  useEffect(() => {
    Cart.getCarts(kapanId, cutId,postProcess)
      .then(res => {
        if (!res.err) {
          setData(parseData(res.data))
        }
        else {
          notificationPopup(res.msg, "error")
        }
      })
      .catch(err => {
        console.log("Error : ", err)
        notificationPopup(JSON.stringify(err), "error")
      })
  }, [loadCarts])


  
  //Pending Weights of Finalized Processes
  const pendingWeight = (process) => {
    return (data[PRE_PROCESS_TYPES[process]]?.weight 
      - data[PRE_PROCESS_TYPES[process]]?.PacketsWeight 
      + data[PRE_PROCESS_TYPES[process]]?.returnWeight).toFixed(3)
  }
  const p = PRE_PROCESS_TYPES
  const [pwORC,pwRC,pwPOL,pwREJ] = [pendingWeight(p.ORIGINAL_RC),pendingWeight(p.RC),pendingWeight(p.POLISHED),pendingWeight(p.REJECTION)]

  return (
    <div className="single">
      <Sidebar />
      <div className="singleContainer">
        <Navbar />
        <div className="bottom">
          <h1 className="title">{postProcess?"Post Processes":"Processes"}</h1>
          {showTWForm.visibility && <TransferWeightForm source={showTWForm.source} onClose={toggleForm} onSubmit={handleSubmit} postProcess={postProcess} />}
          <div className="processSimulator">
            <Processes carts={data} kapanId={kapanId} cutId={cutId} onWeightTransfer={handleSubmit} showTWForm={showTWForm} toggleForm={toggleForm} postProcess = {postProcess} />
            <ArrowRightAltIcon sx={{ fontSize: 100, color: "red" }} />
            <div className="FinalProducts">
              <div className="ProcessContainer">
                {postProcess?"":<div className="inventoryItemContainer">
                  <button className="inventory sink" onClick={(e) => toggleForm(e, PRE_PROCESS_TYPES.ORIGINAL_RC)}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <h2>ORIGINAL RC</h2>
                    </div>
                    <div className="cutInfo">
                      <div className={`BlinkCell ${pwORC <  0?"blink":""}`}>PW : {pwORC}</div>
                      <div>IW : {data[PRE_PROCESS_TYPES.ORIGINAL_RC]?.PacketsWeightActual.toFixed(3)}</div>

                    </div>
                  </button>
                  <button className="view" onClick={(e) => handleCartOpen(e, PRE_PROCESS_TYPES.ORIGINAL_RC)}>{<LocalGroceryStoreIcon />}</button>
                </div>}
                {postProcess?"":<div className="inventoryItemContainer">
                  <button className="inventory sink" onClick={(e) => toggleForm(e, PRE_PROCESS_TYPES.RC)}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <h2>RC</h2>
                    </div>
                    <div className="cutInfo">
                      <div className={`BlinkCell ${pwRC <  0?"blink":""}`}>PW : {pwRC}</div>
                      <div>IW : {data[PRE_PROCESS_TYPES.RC]?.PacketsWeightActual.toFixed(3)}</div>
                    </div>
                  </button>
                  <button className="view" onClick={(e) => handleCartOpen(e, PRE_PROCESS_TYPES.RC)}>{<LocalGroceryStoreIcon />}</button>
                </div>}
                {postProcess?"":<div className="inventoryItemContainer">
                  <button className="inventory sink" onClick={(e) => toggleForm(e, PRE_PROCESS_TYPES.REJECTION)}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <h2>REJECTION</h2>
                    </div>
                    <div className="cutInfo">
                      <div className={`BlinkCell ${pwREJ <  0?"blink":""}`}>PW : {pwREJ}</div>
                      <div>IW : {data[PRE_PROCESS_TYPES.REJECTION]?.PacketsWeightActual.toFixed(3)}</div>

                    </div>
                  </button>
                  <button className="view" onClick={(e) => handleCartOpen(e, PRE_PROCESS_TYPES.REJECTION)}>{<LocalGroceryStoreIcon />}</button>
                </div>}
                <div className="inventoryItemContainer">
                  <button className="inventory sink" onClick={(e) => toggleForm(e, PRE_PROCESS_TYPES.POLISHED)}>
                    <div style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                      <h2>POLISHED</h2>
                    </div>
                    <div className="cutInfo">
                      <div className={`BlinkCell ${pwPOL <  0?"blink":""}`}>PW : {pwPOL}</div>
                      <div>IW : {data[PRE_PROCESS_TYPES.POLISHED]?.PacketsWeightActual.toFixed(3)}</div>

                    </div>
                  </button>
                  <button className="view" onClick={(e) => handleCartOpen(e, PRE_PROCESS_TYPES.POLISHED)}>{<LocalGroceryStoreIcon />}</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Single;
