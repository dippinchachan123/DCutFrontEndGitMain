import "./table.scss";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { useEffect, useState } from "react";
import { PRE_PROCESS_TYPES ,POST_PROCESS_TYPES} from "../../enums/processes";
import TransferWeightForm from "../Forms/transferWeightForm";
import LocalGroceryStoreIcon from '@mui/icons-material/DriveFileMove';
import {useNavigate } from "react-router-dom";


const Processes = ({carts,kapanId,cutId,onWeightTransfer,showTWForm,toggleForm,postProcess}) => {
  const [rows,setRows] = useState([]);
  const navigate = useNavigate();

  if(postProcess){
    kapanId = 1;
  }
  
  useEffect(() => {
    if(carts){
      const rowsNew = []
      for (const key in carts) {
          const processDetails = PRE_PROCESS_TYPES[key];
          if([PRE_PROCESS_TYPES.POLISHED,PRE_PROCESS_TYPES.RC,PRE_PROCESS_TYPES.REJECTION,PRE_PROCESS_TYPES.ORIGINAL_RC].includes(processDetails)){
            continue
          }
          //PostProcess Code
          if(postProcess){
            if([PRE_PROCESS_TYPES.LASER_LOTING,PRE_PROCESS_TYPES.POLISH_LOTING].includes(processDetails)){
              continue
            }
          }


          //Over
          let weightIn = carts[key].PacketsWeight
          rowsNew.push({  
            label : key,
            weightP  : (carts[key].weight - weightIn + carts[key].returnWeight).toFixed(3),
            weightOriginal : carts[key].weight.toFixed(3),
            loss : (carts[key].loss.toFixed(3) > 0 ?  -Math.abs(carts[key].loss.toFixed(3)) : Math.abs(carts[key].loss.toFixed(3))) ,
            weightIn : carts[key].PacketsWeightActual.toFixed(3),
            view : <LocalGroceryStoreIcon />
          }) 
      }
      setRows(rowsNew)
    }
  },[carts,kapanId,cutId])
  
  const handleCartOpen = (e,process) => {
      navigate(`/${postProcess?"PP":""}cart/${kapanId}-${cutId}-${process}`)
  }

  const totalSum = {weightIn : 0,weightP : 0,loss : 0}  

  return (
    <TableContainer component={Paper} className="table">
      {showTWForm.visibility && <TransferWeightForm source={showTWForm.source} onClose={toggleForm} onSubmit={onWeightTransfer} postProcess={postProcess}/>}
      <Table sx={{ minWidth: 150 }} aria-label="simple table">
        <TableHead>
          <TableRow key={"Labels"}>
            <TableCell className="tableCell">Pending Weight</TableCell>
            <TableCell className="tableCell">Process</TableCell>
            <TableCell className="tableCell">Weight In</TableCell>
            <TableCell className="tableCell">Loss</TableCell>
            <TableCell className="tableCell">View</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => {
            totalSum.weightIn += parseFloat(!isNaN(row.weightIn)?row.weightIn:0);
            totalSum.weightP += parseFloat(!isNaN(row.weightP)?row.weightP:0);
            totalSum.loss += parseFloat(!isNaN(row.loss)?row.loss:0);
            return(
            <TableRow key={row.id}>
              <TableCell className="tableCell" style={{alignContent : 'center'}}>
                  <span className={`BlinkCell ${row.weightP <  0?"blink":""}`}>{row.weightP}</span>
              </TableCell>
              <TableCell className="tableCell">
                <button className={'process'} onClick={(e) => toggleForm(e,row.label)}>
                  {(postProcess?POST_PROCESS_TYPES[row.label]:row.label).replaceAll("_"," ")}
                </button>
              </TableCell>
              <TableCell className="tableCell">{row.weightIn}</TableCell>
              <TableCell className="tableCell">
                  <span className ={`BlinkCell ${row.loss >  0?"blink":""}`}>
                    {row.loss}
                  </span>
              </TableCell>
              <TableCell className="tableCell">
                  <button className="view" onClick={(e) => handleCartOpen(e,row.label)}>{row.view}</button>
              </TableCell>
            </TableRow>
          )})}
          <TableRow key={"Total"}>
              <TableCell className="tableCell" style={{alignContent : 'center'}}>
                  <h3>{totalSum.weightP}</h3>
              </TableCell>
              <TableCell className="tableCell">
              </TableCell>
              <TableCell className="tableCell"><h3>{totalSum.weightIn}</h3></TableCell>
              <TableCell className="tableCell">
                  <h3>
                    {totalSum.loss}
                  </h3>
              </TableCell>
              <TableCell className="tableCell">
              </TableCell>
            </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default Processes;
