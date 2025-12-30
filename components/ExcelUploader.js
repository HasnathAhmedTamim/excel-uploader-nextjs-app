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
    <div className="flex items-center justify-center min-h-screen bg-white p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md border border-gray-300">
        <h1 className="text-2xl font-bold text-black mb-2">Upload Excel</h1>
        <p className="text-black mb-6 text-sm">Upload your file and submit data</p>

        <input
          type="file"
          accept=".xlsx, .xls"
          onChange={handleFileUpload}
          className="w-full mb-4 p-2 border border-gray-300 rounded text-black"
        />

        {jsonData.length > 0 && (
          <>
            <div className="bg-white p-3 rounded mb-4 text-black text-sm border border-gray-300">
              ✅ {jsonData.length} rows ready
            </div>
            <button
              onClick={handleSubmit}
              className="w-full bg-black text-white py-2 rounded font-bold hover:bg-gray-800"
            >
              Submit
            </button>
          </>
        )}

        {submitted && apiResponse && (
          <div className="bg-white p-3 rounded text-black text-sm mt-4 border border-gray-300">
            ✅ Success! Data submitted.
          </div>
        )}
      </div>
    </div>
  );
}
