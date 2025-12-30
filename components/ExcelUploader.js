"use client";
import { useState } from "react";
import * as XLSX from "xlsx";
export default function ExcelUploader() {
  const [jsonData, setJsonData] = useState([]);
  const [submitted, setSubmitted] = useState(false);
  const [apiResponse, setApiResponse] = useState(null);

  // Handle file upload and convert to JSON
  const handleFileUpload = (e) => {
    const files = e.target.files;

    // ✅ Step 1: Check if file exists
    if (!files || files.length === 0) {
      alert("Please select an Excel file");
      return;
    }

    const file = files[0];

    // ✅ Step 2: Extra safety check
    if (!(file instanceof Blob)) {
      alert("Invalid file type");
      return;
    }

    const reader = new FileReader();

    reader.onload = (event) => {
      const arrayBuffer = event.target.result;

      const workbook = XLSX.read(arrayBuffer, { type: "array" });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];

      const json = XLSX.utils.sheet_to_json(sheet);
      setJsonData(json);
      setApiResponse(null);
      setSubmitted(false);
    };

    reader.readAsArrayBuffer(file);
  };

  // Submit JSON data to the server
  const handleSubmit = async () => {
    const response = await fetch("/api/push-to-external", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(jsonData),
    });

    const result = await response.json();

    if (result.success) {
      alert("✅ Data sent to external API successfully");
      setApiResponse(result);
      setSubmitted(true);
    } else {
      alert("❌ Failed to send data");
      setApiResponse(result);
    }
  };

  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h2>Upload your Excel File</h2>
      <input type="file" accept=".xlsx, .xls" onChange={handleFileUpload} />

      {jsonData.length > 0 && (
        <>
          <button onClick={handleSubmit} style={{ padding: "10px 20px", cursor: "pointer", backgroundColor: "#4CAF50", color: "white", border: "none", borderRadius: "5px", marginTop: "10px" }}>
            Confirm & Submit
          </button>
        </>
      )}

      {submitted && apiResponse && (
        <>
          <h3>✅ API Response:</h3>
        </>
      )}
    </div>
  );
}
