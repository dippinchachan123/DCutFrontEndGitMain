import 'jspdf-autotable';

export const generatePdf = (pdf,{data,to}) => {
  // Automatically calculate current date and time
  const currentDate = new Date().toLocaleDateString();
  const currentTime = new Date().toLocaleTimeString();

  // Add content to the PDF
  pdf.text(`TO: ${to.split('-')[1]}`, 40, 10);
  pdf.text(`MOBILE NO: ${'_____________________'}`, 10, 20);
  pdf.text(`DATE: ${currentDate}`, 10, 30);
  pdf.text(`TIME: ${currentTime}`, 60, 30);

  // Example: Add a table using jspdf-autotable
  const columns = ['KAPAN NO','CUT NO', 'S NO', 'CUTTING', 'PCS', 'WEIGHT', 'RATE', 'KA WGT', 'Re SIGN'];
  const rows = data.map(item => [item.kapanId, item.cutId,item.id ,item.cutting || "Not Available", item.pieces, item.weight, item.rate || "Not Available", item.kaWgt || "Not Available",'']);

  pdf.autoTable({
    head: [columns],
    body: rows,
    startY: 40,
    theme: 'grid'
  });



  // Calculate the total of the "PCS" column
  const totalPcs = data.reduce((acc, item) => acc + parseInt(item.pcs), 0);

  // Add total to the PDF
  pdf.text(`TOTAL PCS: ${totalPcs}`, 10, pdf.autoTable.previous.finalY + 10);

  pdf.text(`AUTHORIZED SIGN: ${'___________________'}`, 10, pdf.autoTable.previous.finalY + 20);
  pdf.text(`RECEIVER SIGN: ${'_____________________'}`, 10, pdf.autoTable.previous.finalY + 30);
  
  // ... (add more content as needed)
};