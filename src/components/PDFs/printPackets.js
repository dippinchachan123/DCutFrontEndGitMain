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

  // Set the PDF page size to landscape
  

  // Automatically calculate current date and time
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Get the width and height of the PDF after adding the logo
  const pdfWidth = pdf.internal.pageSize.width;
  const pdfHeight = pdf.internal.pageSize.height;

  // Add QR Code to the PDF
  const qrCodeX = pdfWidth/3; // X-coordinate of the QR Code
  const qrCodeY = 40; // Y-coordinate of the QR Code
  const qrCodeSize = 150; // Size of the QR Code


  for(let i = 0;i < data.length;i++){
      if (i > 0) {
        pdf.addPage();
      }
      pdf.text(`Date : ${currentDate}`, pdfWidth - 60, 20);
      pdf.text(`Time : ${currentTime}`, pdfWidth - 60, 30);

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
        ["S NO" ,	element.id],
        ["KP NO" , kapanId],
        ["CUT NO" ,	cutId],
        ["PROCESS",generateShortcut(process)],
        ["LS MM" ,	element.mmvalue || "NA"],
        ["PCS" ,	element.pieces],
        ["WGT" ,	element.weight],
        ["BI" ,	"NA"]
      ]



      pdf.autoTable({
        head: headers,
        body: rows,
        theme : "striped",
        tableWidth: pdfWidth/6,
        tableHeight: pdfHeight/2,
        margin: {left: (pdfWidth/1.3), right: 0, bottom: 0 }, // Set margins to control x and y
        startY : pdfHeight/2.3
      });

      console.log("Here2",data[i])


      const qrCodeData = element.url || config.FRONTEND_DOMAIN; // Replace with your data
      const qrCodeDataURL = await QRCode.toDataURL(qrCodeData)
      // Add content to the PDF
      pdf.addImage(logoImage, 'PNG', 20 , 10, 80, 30);
      pdf.addImage(qrCodeDataURL, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);
  }
}