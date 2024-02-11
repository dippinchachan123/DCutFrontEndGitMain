import React, { useRef } from 'react';
import { generateIssuePdf } from './issuePacketsPdf';
import jsPDF from 'jspdf';
import { generatePrintPdf } from './printPackets';
import { config } from '../../config';


function getData(){
  const data = []
  for(let i = 0;i < 10;i++){
    data.push(
      {
        url : config.FRONTEND_DOMAIN,
        charni: null,
        color: null,
        color2
          :
          null,
        color3
          :
          null,
        cutting
          :
          null,
        diamondContainerId
          :
          "Packet-1b052bc3-8923-4d2c-917d-ee4b49ce688e",
        id
          :
          1,
        issue
          :
          "5-Mohit",
        loss
          :
          0,
        packetId
          :
          "1S1SMLS1"
        , pieces
          :
          10
        , remarks
          :
          "Good Quality!!"
        , return
          :
          null
        , size
          :
          2.3
        , status
          :
          "PENDING"
        , weight
          :
          23
      }
    )
  }
  return data
}

const MyPdfComponent = () => {
  const pdfIframeRef = useRef(null);

  const handleGeneratePdf = async () => {
    const pdf = new jsPDF('l', 'mm', [400, 200]);
    // const pdf = new jsPDF('l', 'mm', [400, 200]);
    pdf.setFont("Calibri", "bold");
    // pdf.setFontSize(14);
    pdf.setTextColor(14, 3, 64);
    // const pdf = new jsPDF()
    // Document of 297mm wide and 210mm high

    const data = getData()
    const to = {name : "1-Dippin Chachan",number : '9610938979'}
    
    await new Promise(async (resolve) => {
      // await generateIssuePdf(pdf, { data, to ,kapanId : 1,process : "LASER_LOTING",cutId : 1});
      await generatePrintPdf(pdf, { data, to ,kapanId : 1,cutId : 1,process:"LASER_LOTING",postProcess : false});
      resolve();
    });
    
    // Convert the PDF to a data URL
    const pdfDataUri = pdf.output('datauristring');

    // Display the PDF in the iframe
    pdfIframeRef.current.src = pdfDataUri;
  };

  return (
    <div>
      <button onClick={handleGeneratePdf}>Generate PDF</button>
      <iframe
        title="Generated PDF"
        ref={pdfIframeRef}
        style={{ width: '100%', height: '1000px' }}
      />
    </div>
  );
};

export default MyPdfComponent;
