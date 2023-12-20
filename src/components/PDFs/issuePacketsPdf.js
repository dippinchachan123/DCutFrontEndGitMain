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


  const centerX = pdfWidth / 2 + 0.6; // Adjust 1.5 as needed for the line thickness

  // Set the line color and width
  pdf.setDrawColor(0); // Black color
  pdf.setLineWidth(0.5); // Adjust the line thickness as needed
  pdf.setLineDash([2, 2]); // Set a dash pattern [dash, gap]

  // Draw a vertical line
  pdf.line(centerX, 0, centerX, pdfHeight);
  pdf.setFontSize(12);
  // Add content to the PDF
  pdf.addImage(logoImage, 'PNG', 5, 5, 40, 30);
  pdf.text(`To : `, pdfWidth - 240 + 10, 10);
  pdf.text(`___________________________`, pdfWidth - 240 + 22, 10.5);
  pdf.text(`${to.name.split('-')[1]}`, pdfWidth - 240 + 22, 9);
  pdf.text(`Mobile No : ${to.number}`, pdfWidth - 240 + 10, 21);
  pdf.text(`___________________________`, pdfWidth - 240 + 32 , 23);

  pdf.text(`Date : ${currentDate}`, pdfWidth - 240 + 10, 35);
  pdf.text(`Time : ${currentTime}`, pdfWidth - 240 + 60, 35);

  // Add mirror content to the PDF
  pdf.addImage(logoImage, 'PNG', pdfWidth/2 + 3, 5, 40, 30);
  pdf.text(`To : `, pdfWidth - 93 + 10, 10);
  pdf.text(`___________________________`, pdfWidth - 93 + 22, 10.5);
  pdf.text(`${to.name.split('-')[1]}`, pdfWidth - 93 + 22, 9)
  pdf.text(`Mobile No : ${to.number}`, pdfWidth - 93 + 10, 21);
  pdf.text(`___________________________`, pdfWidth - 93 + 32, 23);
  pdf.text(`Date : ${currentDate}`, pdfWidth - 93 + 10, 35);
  pdf.text(`Time : ${currentTime}`, pdfWidth - 93 + 60, 35);


  // Example: Add a table using jspdf-autotable
  const columns = ['KAPAN NO', 'CUT NO', 'S NO', 'PROCESS', 'CUTTING', 'PCS', 'WEIGHT', 'RATE', 'KA WGT', 'Re SIGN'];
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

  function generateShortcut(name) {
    // Assuming the name is in the format "Dippin Chachan"
    const initials = name
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('');

    // Use the initials as the shortcut
    return initials;
  }

  const rows = data.map(item => [kapanId, cutId, item.id, generateShortcut(process), item.cutting || "NA", item.pieces, item.weight, "                ", item.kaWgt || "NA", '']);
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
    columnStyles: {
      europe: {
        halign: 'center',
        fontSize: 5 // Set the font size for each column

      }
    },
    margin : {left : 5},
    tableWidth: pdfWidth/2.1,
    head: [columns],
    body: rows,
    startY: 40,
    halign: 'left',
    theme: 'grid'
  });

  //Mirrored Table
  pdf.autoTable({
    columnStyles: {
      europe: {
        halign: 'center',
        fontSize: 5 // Set the font size for each column

      }
    },
    margin : {left : pdfWidth/2 + 3},
    tableWidth: pdfWidth/2.1,
    head: [columns],
    body: rows,
    startY: 40,
    halign: 'left',
    theme: 'grid'
  });


  // Add total to the PDF
  pdf.setFontSize(10);
  pdf.text(`AUTHORIZED SIGN : ${'___________________'}`, 5, pdf.autoTable.previous.finalY + 15);
  pdf.text(`RECEIVER SIGN : ${'_____________________'}`, 5, pdf.autoTable.previous.finalY + 25);


    // Add total to the PDF (Mirrored)
    pdf.setFontSize(10);
    pdf.text(`AUTHORIZED SIGN : ${'___________________'}`, pdfWidth/2 + 3, pdf.autoTable.previous.finalY + 15);
    pdf.text(`RECEIVER SIGN : ${'_____________________'}`, pdfWidth/2 + 3, pdf.autoTable.previous.finalY + 25);
  

  // ... (add more content as needed)
};