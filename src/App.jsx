import React, { useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import BillForm from './components/BillForm.jsx';
import { generatePDF } from './utils/generatePDF.js';
import Logo from './assets/Logo.png';

const App = () => {
  const [bill, setBill] = useState(null);
  const [whatsappMessage, setWhatsappMessage] = useState('');

  const handleBillGeneration = (billData, message) => {
    setBill(billData);
    setWhatsappMessage(message);
    // Export to Google Sheets is now triggered by "Add Data" button
    toast.success('Bill generated successfully!', { position: 'top-right' });
  };

  const handleLiveBillUpdate = (billData) => {
    setBill(billData);
  };

  const exportToGoogleSheets = async (billData) => {
    try {
      const response = await fetch('https://script.google.com/macros/s/AKfycbwnN3mkDD2bcU43QbVwU1psTn6NnfHRtZTzXDNCKIUBnxNXpjxSvbkWdL-_b6Fl4h8/exec', {
        method: 'POST',
        mode: 'no-cors', // Use no-cors for local testing
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(billData),
      });
      toast.success('Data exported to Google Sheets!', { position: 'top-right' });
      console.log('Data exported to Google Sheets:', response);
    } catch (error) {
      toast.error('Failed to export to Google Sheets. Please check the connection or Apps Script URL.', { position: 'top-right' });
      console.error('Error exporting to Google Sheets:', error);
    }
  };

  const handleDownloadPDF = () => {
    if (!bill) {
      toast.error('No bill data available. Please generate a bill first.', { position: 'top-right' });
      return;
    }
    generatePDF(bill);
    toast.success('PDF downloaded successfully!', { position: 'top-right' });
  };

  const handleCopyWhatsApp = () => {
    if (!whatsappMessage) {
      toast.error('No WhatsApp message available. Please generate a bill first.', { position: 'top-right' });
      return;
    }
    navigator.clipboard.writeText(whatsappMessage);
    toast.success('WhatsApp message copied to clipboard!', { position: 'top-right' });
  };

  const handleAddData = () => {
    if (!bill) {
      toast.error('No bill data available to export.', { position: 'top-right' });
      return;
    }
    exportToGoogleSheets(bill);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <ToastContainer />
      <div className="w-full max-w-3xl bg-white rounded-lg shadow-lg p-8">
        <div className="flex justify-center mb-6">
          <img src={Logo} alt="BillMitra Logo" className="h-16 w-auto" />
        </div>
        <h1 className="text-3xl font-bold text-blue-600 mb-6 text-center">BillMitra</h1>
        <BillForm onGenerateBill={handleBillGeneration} onLiveBillUpdate={handleLiveBillUpdate} />
        {bill && (
          <div className="mt-8 p-6 bg-gray-50 rounded-lg shadow-inner animate-fade-in">
            <h2 className="text-2xl font-bold text-blue-600 mb-4">Bill Summary</h2>
            <div className="space-y-2 text-gray-700">
              <p><strong>Bill ID:</strong> {bill.billId}</p>
              <p><strong>Tenant:</strong> {bill.tenantName || 'Tenant'}</p>
              <p><strong>Billing Period:</strong> {bill.startDate} to {bill.endDate}</p>
              <p><strong>Due Date:</strong> {bill.dueDate}</p>
              <p><strong>Main Meter Units:</strong> {bill.mainUnits}</p>
              <p><strong>Motor Units:</strong> {bill.motorUnits}</p>
              <p><strong>Owner Units:</strong> {bill.ownerUnits}</p>
              <p><strong>Tenant Units:</strong> {bill.tenantUnits}</p>
              <p><strong>Tenant Total Units:</strong> {bill.tenantTotalUnits.toFixed(2)}</p>
              <p><strong>Electricity Bill (Govt):</strong> ₹{bill.govtElectricityBill.toFixed(2)}</p>
              <p><strong>Discount Applied:</strong> ₹{bill.discountApplied.toFixed(2)}</p>
              <p><strong>Final Electricity Bill:</strong> ₹{bill.finalElectricityBill.toFixed(2)}</p>
              <p><strong>Water Bill:</strong> ₹{bill.waterBill.toFixed(2)}</p>
              <p><strong>Tanker Split:</strong> ₹{bill.tankerSplit.toFixed(2)}</p>
              <p><strong>House Rent:</strong> ₹{bill.houseRent.toFixed(2)}</p>
              <p><strong>Total Bill:</strong> ₹{bill.totalBill.toFixed(2)}</p>
              <p><strong>Generated on:</strong> {bill.timestamp}</p>
            </div>
            <div className="mt-6 flex flex-col sm:flex-row sm:space-x-4 space-y-2 sm:space-y-0">
              <button
                onClick={handleDownloadPDF}
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-300"
              >
                Download PDF
              </button>
              <button
                onClick={handleCopyWhatsApp}
                className="bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition duration-300"
              >
                Copy WhatsApp Message
              </button>
              <button
                onClick={handleAddData}
                className="bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition duration-300"
              >
                Add Data
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;