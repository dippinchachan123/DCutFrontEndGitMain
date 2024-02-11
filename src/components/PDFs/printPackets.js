import 'jspdf-autotable';
import QRCode from 'qrcode';
import logoImage from '../../LOGO.jpeg';
import {
  config
} from '../../config';
import { Kapan } from '../../apis/api.kapan';
import { Cut } from '../../apis/api.cut';



export const generatePrintPdf = async (pdf, {
  data,
  kapanId,
  cutId,
  process,
  postProcess
}) => {
  // Set the width and height based on the landscape aspect ratio (2:1)
  const w = 210; // Adjust as needed
  const h = w / 2;

  const downShift = 5

  // Get the width and height of the PDF after adding the logo
  const pdfWidth = pdf.internal.pageSize.width;
  const pdfHeight = pdf.internal.pageSize.height;

  // Add QR Code to the PDF
  const qrCodeX = 3; // X-coordinate of the QR Code
  const qrCodeY = 40; // Y-coordinate of the QR Code
  const qrCodeSize = 150; // Size of the QR Code

  for (let i = 0; i < data.length; i++) {
    if (i > 0) {
      pdf.addPage();
    }

    const createdDate = data[i].created.time.split('-')[1]
    const createdTime = data[i].created.time.split('-')[0]


    pdf.setFontSize(25); // Set the font size for the date and time
    pdf.setFont('normal'); // Reset font style
    pdf.text(`Date : ${createdDate}`, pdfWidth - 100, 20 + downShift);
    pdf.text(`Time : ${createdTime}`, pdfWidth - 100, 30 + downShift);

    // Set up the table headers
    const headers = [
      ['Key', 'Value']
    ];

    // Set up the table data
    const element = data[i]

    function generateShortcut(name) {
      // Assuming the name is in the format "Dippin Chachan"
      const initials = name
        .split(' ')
        .map(word => word.charAt(0).toUpperCase())
        .join('');

      // Use the initials as the shortcut
      return initials;
    }

    let kapanWgt = await Kapan.getKapanByID(kapanId,postProcess)
    let cutWgt = 'NA'
    if(!postProcess){
      cutWgt = await Cut.getCutByID(kapanId,cutId,postProcess)
      cutWgt = cutWgt?.data[0]?.cuts[0]?.weight || "NA"
    }

    kapanWgt = kapanWgt?.data[0]?.weight || "NA"

    const rows = [
      ["S NO", {
        content: element.id,
        fontStyle: 'bold',
        fontSize: 22
      }],
      ["KP WGt", {
        content: kapanWgt,
        fontStyle: 'bold',
        fontSize: 22
      }],
      ["CUT WGt", {
        content: cutWgt,
        fontStyle: 'bold',
        fontSize: 22
      }],
      ["PROCESS", {
        content: generateShortcut(process),
        fontStyle: 'bold',
        fontSize: 22
      }],
      ["LS MM", {
        content: element.mmvalue || "NA",
        fontStyle: 'bold',
        fontSize: 22
      }],
      ["PCS", {
        content: element.pieces,
        fontStyle: 'bold',
        fontSize: 22
      }],
      ["WGT", {
        content: element.weight,
        fontStyle: 'bold',
        fontSize: 22
      }],
      ["BI", {
        content: "        ",
        fontStyle: 'bold',
        fontSize: 22
      }]
    ];

    pdf.autoTable({
      head: headers,
      body: rows,
      theme: "striped",
      tableWidth: pdfWidth / 2,
      margin: {
        left: (pdfWidth / 2.3),
        right: 0,
        bottom: 0
      }, // Set margins to control x and y
      startY: pdfHeight / 3.4 +  downShift,
      styles: {
        fontSize: 22,
        fontStyle: 'bold'
      } // Set the font size and boldness for the table

    });

    const qrCodeData = element.url || config.FRONTEND_DOMAIN; // Replace with your data
    const qrCodeDataURL = await QRCode.toDataURL(qrCodeData)
    // Add content to the PDF
    pdf.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY + downShift, qrCodeSize, qrCodeSize);
    pdf.addImage(logoImage, 'PNG', 19, 10 + downShift, 60, 38);
  }
}