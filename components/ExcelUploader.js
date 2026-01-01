"use client";
import { useState } from "react";
import * as XLSX from "xlsx";

export default function ExcelUploader() {
  const [jsonData, setJsonData] = useState([]);
  const [apiResponse, setApiResponse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [storedContacts, setStoredContacts] = useState([]);

  // Handle Excel upload
  const handleFileUpload = (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) {
      alert("Please select a file");
      return;
    }

    const file = files[0];
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
      const json = XLSX.utils.sheet_to_json(sheet, { raw: false, defval: "" });
      console.log("📋 Parsed Excel data (first row):", json[0]);
      console.log("📋 All parsed data:", json);
      setJsonData(json);
    };
    reader.readAsArrayBuffer(file);
  };

  // Submit to API
  const handleSubmit = async () => {
    if (!jsonData.length) {
      alert("No data to submit");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/push-to-external", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(jsonData),
      });
      const result = await res.json();
      setApiResponse(result);

      if (result.success) {
        alert("✅ Data sent successfully!");
        setJsonData([]);
        // Fetch stored contacts
        fetchStoredContacts();
      } else {
        alert("❌ Failed: " + result.message);
      }
    } catch (err) {
      console.error(err);
      alert("❌ Error: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  // Fetch stored contacts from our backend (which calls external API)
  const fetchStoredContacts = async () => {
    try {
      const res = await fetch("/api/get-contacts");
      const result = await res.json();
      if (result.success) {
        setStoredContacts(result.data);
      } else {
        console.error("Error:", result.message);
      }
    } catch (err) {
      console.error("Error fetching contacts:", err);
    }
  };

  return (
    <div>
      {/* Upload Section */}
      <div className="border border-gray-300 p-5 rounded-lg mb-5 bg-gray-50">
        <h2 className="text-xl font-bold mb-3">1️⃣ Upload Excel File</h2>
        <p className="text-sm text-gray-600 mb-3">
          Columns needed: name, number, mail, country
        </p>
        <input
          type="file"
          accept=".xlsx,.xls,.csv"
          onChange={handleFileUpload}
          className="p-2 border border-gray-300 rounded w-full mb-3 cursor-pointer"
        />

        {jsonData.length > 0 && (
          <>
            <p className="text-green-600 font-bold mb-3">
              ✅ {jsonData.length} rows ready
            </p>
            <button
              onClick={handleSubmit}
              disabled={loading}
              className={`px-5 py-2 rounded text-white font-semibold transition ${
                loading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 cursor-pointer"
              }`}
            >
              {loading ? "Sending..." : "📤 Submit to API"}
            </button>
          </>
        )}
      </div>

      {/* Excel Preview */}
      {jsonData.length > 0 && (
        <div className="mb-5">
          <h3 className="text-lg font-bold mb-3">2️⃣ Excel Preview</h3>
          <div className="overflow-x-auto border border-gray-300 rounded p-3 bg-white">
            <table className="w-full border-collapse text-sm">
              <thead>
                <tr className="bg-gray-100">
                  {jsonData.length > 0 &&
                    Object.keys(jsonData[0]).map((key) => (
                      <th
                        key={key}
                        className="p-2 border border-gray-300 text-left font-bold"
                      >
                        {key}
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody>
                {jsonData.map((row, idx) => (
                  <tr
                    key={idx}
                    className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
                  >
                    {Object.values(row).map((val, cidx) => (
                      <td
                        key={cidx}
                        className="p-2 border border-gray-300 text-xs"
                      >
                        {String(val)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* API Response */}
      {apiResponse && (
        <div
          className={`border border-gray-300 p-4 rounded-lg mb-5 ${
            apiResponse.success ? "bg-green-50" : "bg-red-50"
          }`}
        >
          <h3 className="text-lg font-bold mb-3">3️⃣ API Response</h3>
          <pre className="bg-gray-100 p-2 rounded text-xs overflow-x-auto">
            {JSON.stringify(apiResponse, null, 2)}
          </pre>
        </div>
      )}
{/* 
      Stored Contacts */}
      {/* {storedContacts.length > 0 && (
        <div
          style={{
            border: "1px solid #ddd",
            padding: "15px",
            borderRadius: "8px",
            backgroundColor: "#e3f2fd",
          }}
        >
          <h3>4️⃣ Contacts Stored in External API ({storedContacts.length})</h3>
          <div
            style={{
              overflowX: "auto",
              border: "1px solid #ddd",
              borderRadius: "4px",
              padding: "10px",
              backgroundColor: "#fff",
            }}
          >
            <table
              style={{
                width: "100%",
                borderCollapse: "collapse",
                fontSize: "14px",
              }}
            >
              <thead>
                <tr style={{ backgroundColor: "#f0f0f0" }}>
                  <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>
                    ID
                  </th>
                  <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>
                    Name
                  </th>
                  <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>
                    Number
                  </th>
                  <th style={{ padding: "8px", border: "1px solid #ddd", textAlign: "left" }}>
                    Country
                  </th>
                </tr>
              </thead>
              <tbody>
                {storedContacts.map((contact, idx) => (
                  <tr key={idx} style={{ backgroundColor: idx % 2 ? "#f9f9f9" : "#fff" }}>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>{contact.id}</td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {contact.name}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {contact.number}
                    </td>
                    <td style={{ padding: "8px", border: "1px solid #ddd" }}>
                      {contact.country}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )} */}
    </div>
  );
}