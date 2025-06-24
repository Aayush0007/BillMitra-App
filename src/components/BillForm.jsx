import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Logo from "../assets/Logo.png";

const BillForm = ({ onGenerateBill, onLiveBillUpdate }) => {
  const [formData, setFormData] = useState({
    tenantName: "",
    startDate: "",
    endDate: "",
    mainStart: "",
    mainClose: "",
    motorStart: "",
    motorClose: "",
    ownerStart: "",
    ownerClose: "",
    tenantStart: "",
    tenantClose: "",
    discountRate: "9",
    tankerUsed: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const validateForm = () => {
    const {
      tenantName,
      startDate,
      endDate,
      mainStart,
      mainClose,
      motorStart,
      motorClose,
      ownerStart,
      ownerClose,
      tenantStart,
      tenantClose,
    } = formData;

    if (
      !tenantName ||
      !startDate ||
      !endDate ||
      mainStart === "" ||
      mainClose === "" ||
      motorStart === "" ||
      motorClose === "" ||
      ownerStart === "" ||
      ownerClose === "" ||
      tenantStart === "" ||
      tenantClose === ""
    ) {
      return false; // No toast here since live preview handles validation
    }

    const numericFields = [
      { name: "Main Meter", start: mainStart, close: mainClose },
      { name: "Motor", start: motorStart, close: motorClose },
      { name: "Owner", start: ownerStart, close: ownerClose },
      { name: "Tenant", start: tenantStart, close: tenantClose },
    ];

    for (const field of numericFields) {
      if (isNaN(field.start) || isNaN(field.close)) {
        return false;
      }
      if (Number(field.close) < Number(field.start)) {
        return false;
      }
    }

    if (new Date(endDate) < new Date(startDate)) {
      return false;
    }

    return true;
  };

  const calculateBill = () => {
    if (!validateForm()) {
      return null;
    }

    const {
      tenantName,
      startDate,
      endDate,
      mainStart,
      mainClose,
      motorStart,
      motorClose,
      ownerStart,
      ownerClose,
      tenantStart,
      tenantClose,
      discountRate,
      tankerUsed,
    } = formData;

    const mainUnits = Number(mainClose) - Number(mainStart);
    const motorUnits = Number(motorClose) - Number(motorStart);
    const ownerUnits = Number(ownerClose) - Number(ownerStart);
    const tenantUnits = Number(tenantClose) - Number(tenantStart);
    const tenantTotalUnits = tenantUnits + 0.75 * motorUnits;
    const govtRate = 9;
    const govtElectricityBill = tenantTotalUnits * govtRate;
    const finalElectricityBill = tenantTotalUnits * Number(discountRate);
    const discountApplied = govtElectricityBill - finalElectricityBill;
    const waterBill = 150;
    const tankerSplit = tankerUsed ? 150 : 0;
    const houseRent = 7500;
    const totalBill =
      finalElectricityBill + waterBill + tankerSplit + houseRent;
    const billId = `BILL-${Date.now()}`;
    const dueDate = new Date(
      new Date().getTime() + 7 * 24 * 60 * 60 * 1000
    ).toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata" });

    const billData = {
      billId,
      tenantName,
      startDate,
      endDate,
      mainUnits,
      motorUnits,
      ownerUnits,
      tenantUnits,
      tenantTotalUnits,
      govtRate,
      discountRate: Number(discountRate),
      govtElectricityBill,
      discountApplied,
      finalElectricityBill,
      waterBill,
      tankerSplit,
      houseRent,
      totalBill,
      timestamp: new Date().toLocaleString("en-IN", {
        timeZone: "Asia/Kolkata",
      }),

      dueDate,
    };

    const message = `प्रिय ${billData.tenantName || "किरायेदार"},  
आप हमारे परिवार के जैसे हैं। यह रहा आपका बिल (${billData.startDate} से ${
      billData.endDate
    }):  
- बिजली बिल (सरकारी): ₹${billData.govtElectricityBill.toFixed(2)}  
- छूट: ₹${billData.discountApplied.toFixed(2)}  
- अंतिम बिजली बिल: ₹${billData.finalElectricityBill.toFixed(2)}  
- पानी बिल: ₹${billData.waterBill.toFixed(2)}  
${
  billData.tankerUsed
    ? `- टैंकर शुल्क: ₹${billData.tankerSplit.toFixed(2)}\n`
    : ""
}- मकान किराया: ₹${billData.houseRent.toFixed(2)}  
**कुल बिल: ₹${billData.totalBill.toFixed(2)}**  

कृपया ${billData.dueDate} तक भुगतान करें। हम आपके सहयोग की सराहना करते हैं।  
स्नेह सहित,  
BillMitra`;

    onGenerateBill(billData, message);
    return billData;
  };

  useEffect(() => {
    const billData = calculateBill();
    onLiveBillUpdate(billData);
  }, [formData]);

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <img src={Logo} alt="BillMitra Logo" className="h-12 w-auto" />
      </div>
      <form className="space-y-4">
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            title="Enter the tenant's full name"
          >
            Tenant Name
          </label>
          <input
            type="text"
            name="tenantName"
            value={formData.tenantName}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
            placeholder="Enter tenant name"
            required
          />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Select the billing period start date"
            >
              Start Date
            </label>
            <input
              type="date"
              name="startDate"
              value={formData.startDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Select the billing period end date"
            >
              End Date
            </label>
            <input
              type="date"
              name="endDate"
              value={formData.endDate}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              required
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Enter the starting reading for the main meter"
            >
              Main Meter Start
            </label>
            <input
              type="number"
              name="mainStart"
              value={formData.mainStart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="0"
              required
              min="0"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Enter the closing reading for the main meter"
            >
              Main Meter Close
            </label>
            <input
              type="number"
              name="mainClose"
              value={formData.mainClose}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="0"
              required
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Enter the starting reading for the motor meter"
            >
              Motor Start
            </label>
            <input
              type="number"
              name="motorStart"
              value={formData.motorStart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="0"
              required
              min="0"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Enter the closing reading for the motor meter"
            >
              Motor Close
            </label>
            <input
              type="number"
              name="motorClose"
              value={formData.motorClose}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="0"
              required
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Enter the starting reading for the owner meter"
            >
              Owner Start
            </label>
            <input
              type="number"
              name="ownerStart"
              value={formData.ownerStart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="0"
              required
              min="0"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Enter the closing reading for the owner meter"
            >
              Owner Close
            </label>
            <input
              type="number"
              name="ownerClose"
              value={formData.ownerClose}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="0"
              required
              min="0"
            />
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Enter the starting reading for the tenant meter"
            >
              Tenant Start
            </label>
            <input
              type="number"
              name="tenantStart"
              value={formData.tenantStart}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="0"
              required
              min="0"
            />
          </div>
          <div>
            <label
              className="block text-gray-700 font-medium mb-1"
              title="Enter the closing reading for the tenant meter"
            >
              Tenant Close
            </label>
            <input
              type="number"
              name="tenantClose"
              value={formData.tenantClose}
              onChange={handleChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
              placeholder="0"
              required
              min="0"
            />
          </div>
        </div>
        <div>
          <label
            className="block text-gray-700 font-medium mb-1"
            title="Select the discount rate per unit"
          >
            Discount Rate (₹/unit)
          </label>
          <select
            name="discountRate"
            value={formData.discountRate}
            onChange={handleChange}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 transition duration-200"
          >
            <option value="9">Rs. 9 (No Discount)</option>
            <option value="8">Rs. 8</option>
            <option value="7.5">Rs. 7.5</option>
          </select>
        </div>
        <div className="flex items-center">
          <input
            type="checkbox"
            name="tankerUsed"
            checked={formData.tankerUsed}
            onChange={handleChange}
            className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            title="Check if a water tanker was used"
          />
          <label className="ml-2 text-gray-700 font-medium">
            Water Tanker Used
          </label>
        </div>
      </form>
    </div>
  );
};

export default BillForm;
