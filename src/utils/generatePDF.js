import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import Logo from '../assets/Logo.png';

export const generatePDF = (billData) => {
  const doc = new jsPDF();
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(14);

  // Header
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(37, 99, 235); // #2563eb
  doc.text('BillMitra', 14, 20);
  doc.setFontSize(14);
  doc.text('Tenant Bill', 14, 30);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(12);
  doc.setTextColor(51, 51, 51); // #333333
  doc.text(`Bill ID: ${billData.billId}`, 14, 40);
  doc.text(`Tenant: ${billData.tenantName || 'Tenant'}`, 14, 50);
  doc.text(`Billing Period: ${billData.startDate} to ${billData.endDate}`, 14, 60);
  doc.text(`Due Date: ${billData.dueDate}`, 14, 70);
  doc.text(`Generated on: ${billData.timestamp}`, 14, 80);

  // Add Logo
  try {
    doc.addImage(Logo, 'PNG', 160, 10, 40, 40);
  } catch (error) {
    console.warn('Logo could not be added to PDF:', error);
  }

  // Bill Table
  autoTable(doc, {
    startY: 90,
    head: [['Description', 'Amount']],
    body: [
      ['Main Meter Units', `${billData.mainUnits}`],
      ['Motor Units', `${billData.motorUnits}`],
      ['Owner Units', `${billData.ownerUnits}`],
      ['Tenant Units', `${billData.tenantUnits}`],
      ['Tenant Total Units (Tenant + 0.75 * Motor)', `${billData.tenantTotalUnits.toFixed(2)}`],
      ['Electricity Bill (Govt. Rate @ Rs.9)', `Rs. ${billData.govtElectricityBill.toFixed(2)}`],
      [`Discount Applied (@ Rs.${billData.discountRate})`, `₹ ${billData.discountApplied.toFixed(2)}`],
      ['Final Electricity Bill', `Rs. ${billData.finalElectricityBill.toFixed(2)}`],
      ['Water Bill', `Rs. ${billData.waterBill.toFixed(2)}`],
      ['Tanker Split', `Rs. ${billData.tankerSplit.toFixed(2)}`],
      ['House Rent', `Rs. ${billData.houseRent.toFixed(2)}`],
      ['Total Bill', `Rs. ${billData.totalBill.toFixed(2)}`],
    ],
    styles: { fillColor: [243, 244, 246], textColor: [51, 51, 51], fontSize: 10, font: 'helvetica' },
    headStyles: { fillColor: [37, 99, 235], textColor: [255, 255, 255], fontSize: 10, font: 'helvetica' },
    margin: { left: 14, right: 14 },
  });

  // Footer
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text('Contact: Phone: +91-946-130-8118', 14, doc.internal.pageSize.height - 10);

  doc.save(`BillMitra_${billData.billId}.pdf`);
};