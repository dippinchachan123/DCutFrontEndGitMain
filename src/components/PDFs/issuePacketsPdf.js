import 'jspdf-autotable';
import logoImage from '../../LOGO.jpeg';


export const generateIssuePdf = async (pdf, {
  data,
  to,
  kapanId,
  process,
  cutId
}) => {
  // Automatically calculate current date and time
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Get the width and height of the PDF after adding the logo
  const pdfWidth = pdf.internal.pageSize.width;
  const pdfHeight = pdf.internal.pageSize.height;


  // Add content to the PDF
  pdf.addImage(logoImage, 'PNG', 14.5, 5, 40, 30);
  pdf.text(`To : `, pdfWidth - 120 + 10, 10);
  pdf.text(`___________________________`, pdfWidth - 120 + 22, 10.5);
  pdf.text(`${to.split('-')[1]}`, pdfWidth - 120 + 22, 9)
  pdf.text(`Mobile No : ${'_____________________'}`, pdfWidth - 120 + 10, 23);
  pdf.text(`Date : ${currentDate}`, pdfWidth - 120 + 10, 35);
  pdf.text(`Time : ${currentTime}`, pdfWidth - 120 + 60, 35);


  // Example: Add a table using jspdf-autotable
  const columns = ['KAPAN NO', 'CUT NO', 'S NO', 'PROCESS','CUTTING', 'PCS', 'WEIGHT', 'RATE', 'KA WGT', 'Re SIGN'];
  let totalPcs = 0;
  let totalWeight = 0;
  let totalKaWeight = 0;

  for (const element of data) {
    // Check if the properties are numbers or floats before adding to totals
    if (typeof element.pieces === 'number' && !isNaN(element.pieces)) {
      totalPcs += element.pieces;
    }

    if (typeof element.weight === 'number' && !isNaN(element.weight)) {
      totalWeight += element.weight;
    }

    if (typeof element.kaWgt === 'number' && !isNaN(element.kaWgt)) {
      totalKaWeight += element.kaWgt;
    }
  }

  const rows = data.map(item => [kapanId, cutId, item.id,process,item.cutting || "NA", item.pieces, item.weight, "                ", item.kaWgt || "NA", '']);
  rows.push([
    "Total",
    "",
    "",
    "",
    "",
    totalPcs,
    totalWeight,
    "            ",
    totalKaWeight,
    ""
  ])
  console.log(rows)

  pdf.autoTable({
    styles: {
      margin: [255, 0, 0]
    },
    columnStyles: {
      europe: {
        halign: 'center'
      }
    }, // European countries centered
    head: [columns],
    body: rows,
    startY: 40,
    halign: 'left',
    startX: 0,
    theme: 'grid'
  });




  // Add total to the PDF

  pdf.text(`AUTHORIZED SIGN : ${'___________________'}`, 14, pdf.autoTable.previous.finalY + 20);
  pdf.text(`RECEIVER SIGN : ${'_____________________'}`, 14, pdf.autoTable.previous.finalY + 40);

  // ... (add more content as needed)
};