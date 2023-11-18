import React from 'react';
import { jsPDF } from 'jspdf';
import QRCodeSVG from 'qrcode-svg';
import { config } from '../../config';
import {Canvg} from 'canvg';


export const generatePDF = (details,packets) => {
  const pdf = new jsPDF();
  const {kapanId, cutId,process } = details;
  packets.forEach(async (data, index) => {
    const {packetId,weight,pieces} = data
    const url = `${config.FRONTEND_DOMAIN}/cart/${kapanId}-${cutId}-${process}`
    // Add a new page for each data entry
    if (index !== 0) {
      pdf.addPage();
    }
    // QR code
    const qrCodeSize = 80;
    const qrCodeX = (pdf.internal.pageSize.width - qrCodeSize) / 2;
    const qrCodeY = (pdf.internal.pageSize.height - qrCodeSize) / 2;

    // Generate an SVG QR code
    const qrCodeSvg = new QRCodeSVG({ content:url, padding: 0, width: qrCodeSize, height: qrCodeSize });
    const svgString = qrCodeSvg.svg();

    // Convert SVG to canvas using Canvg
    const canvas = document.createElement('canvas');
    const context = canvas.getContext('2d');
    await Canvg.from(canvas, svgString);

    // Convert canvas to data URL
    const qrCodeDataUrl = canvas.toDataURL('image/png');


    pdf.addImage(qrCodeDataUrl, 'PNG', qrCodeX, qrCodeY, qrCodeSize, qrCodeSize);

    // Information on the side
    const textX = qrCodeX + qrCodeSize + 20;
    const textY = qrCodeY + 10;

    // Display additional details
    pdf.text(`Kapan ID: ${kapanId}`, textX, textY);
    pdf.text(`Cut ID: ${cutId}`, textX, textY + 10);
    pdf.text(`Process : ${process}`, textX, textY + 20);
    pdf.text(`Packet ID: ${packetId}`, textX, textY + 30);
    pdf.text(`Weight: ${weight} g`, textX, textY + 40);
    pdf.text(`Pieces: ${pieces}`, textX, textY + 50);

    // Adjust the font size and style if necessary
    pdf.setFontSize(12);
    pdf.setFont('Arial', 'normal');
  });

  pdf.save('QRCodePDF.pdf');
};


