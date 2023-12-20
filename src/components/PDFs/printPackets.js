import 'jspdf-autotable';
import QRCode from 'qrcode';
import logoImage from '../../LOGO.jpeg';
import { config } from '../../config';



export const  generatePrintPdf = async (pdf, {
  data,
  kapanId,
  cutId,
  process,
}) => {
  // Set the width and height based on the landscape aspect ratio (2:1)
  const w = 210;  // Adjust as needed
  const h = w / 2;



  // Get the width and height of the PDF after adding the logo
  const pdfWidth = pdf.internal.pageSize.width;
  const pdfHeight = pdf.internal.pageSize.height;

  // Add QR Code to the PDF
  const qrCodeX = 3; // X-coordinate of the QR Code
  const qrCodeY = 40; // Y-coordinate of the QR Code
  const qrCodeSize = 150; // Size of the QR Code

  for(let i = 0;i < data.length;i++){
      if (i > 0) {
        pdf.addPage();
      }

      const createdDate = data[i].created.time.split('-')[1]
      const createdTime = data[i].created.time.split('-')[0]

      pdf.setFontSize(25); // Set the font size for the date and time
      pdf.setFont('normal'); // Reset font style
      pdf.text(`Date : ${createdDate}`, pdfWidth - 80, 20);
      pdf.text(`Time : ${createdTime}`, pdfWidth - 80, 30);

      // Set up the table headers
      const headers = [['Key', 'Value']];

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

      const rows = [
        ["S NO", {content: element.id, fontStyle: 'bold', fontSize: 22}],
        ["KP NO", {content: kapanId, fontStyle: 'bold', fontSize: 22}],
        ["CUT NO", {content: cutId, fontStyle: 'bold', fontSize: 22}],
        ["PROCESS", {content: generateShortcut(process), fontStyle: 'bold', fontSize: 22}],
        ["LS MM", {content: element.mmvalue || "NA", fontStyle: 'bold', fontSize: 22}],
        ["PCS", {content: element.pieces, fontStyle: 'bold', fontSize: 22}],
        ["WGT", {content: element.weight, fontStyle: 'bold', fontSize: 22}],
        ["BI", {content: "NA", fontStyle: 'bold', fontSize: 22}]
      ];

      pdf.autoTable({
        head: headers,
        body: rows,
        theme : "striped",
        tableWidth: pdfWidth/2,
        margin: {left: (pdfWidth/2.3), right: 0, bottom: 0 }, // Set margins to control x and y
        startY : pdfHeight/3.4,
        styles: { fontSize: 22, fontStyle: 'bold' } // Set the font size and boldness for the table

      });

      const qrCodeData = element.url || config.FRONTEND_DOMAIN; // Replace with your data
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData)
      // Add content to the PDF
      pdf.addImage(logoImage, 'PNG', 20 , 10, 80, 22);
      pdf.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
  }
}