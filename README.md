BillMitra
A React-based application for generating tenant bills, creating PDF bills, and exporting data to Google Sheets.
Setup Instructions

Install Dependencies:
npm install


Run Development Server:
npm run dev


Build for Production:
npm run build


Google Sheets Integration:

Open the Google Sheet: Link.
Create a tab named Sheet1 with headers: Start Date, End Date, Main Meter Units, Motor Units, Owner Units, Tenant Units, Tenant Total Units, Government Rate, Discount Rate, Electricity Bill (Government), Discount Applied, Final Electricity Bill, Water Bill, Tanker Split, House Rent, Total Bill, Timestamp.
Set up Google Apps Script (see Code.gs below) and deploy as a web app to get the URL.


Logo:

Place your logo in src/assets/logo.png and uncomment the addImage line in src/utils/generatePDF.js.



Google Apps Script (Code.gs)
function doPost(e) {
  try {
    const sheet = SpreadsheetApp.openById('1aHCLRbxL9fY5tbMA11jd8QQJtX86zbzvYguICHFeKt8').getSheetByName('Sheet1');
    const data = JSON.parse(e.postData.contents);
    
    sheet.appendRow([
      data.startDate,
      data.endDate,
      data.mainUnits,
      data.motorUnits,
      data.ownerUnits,
      data.tenantUnits,
      data.tenantTotalUnits,
      data.govtRate,
      data.discountRate,
      data.govtElectricityBill,
      data.discountApplied,
      data.finalElectricityBill,
      data.waterBill,
      data.tankerSplit,
      data.houseRent,
      data.totalBill,
      data.timestamp,
    ]);
    
    return ContentService.createTextOutput(JSON.stringify({ status: 'success' }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({ error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

Deployment

Deploy to Vercel: Run npm run build and deploy the dist folder.
Ensure the Google Apps Script web app URL is updated in src/App.jsx.

Notes

The application uses Tailwind CSS for styling with a gray and blue theme.
PDF generation uses jsPDF and jspdf-autotable.
Test on mobile and desktop for responsiveness.
