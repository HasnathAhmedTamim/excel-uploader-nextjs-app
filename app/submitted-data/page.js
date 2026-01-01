"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function SubmittedData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/submitted-data");
      const result = await response.json();
      setData(result);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const clearData = async () => {
    if (confirm("Are you sure you want to clear all data?")) {
      try {
        await fetch("/api/submitted-data", { method: "DELETE" });
        fetchData();
      } catch (err) {
        setError(err.message);
      }
    }
  };

  return (
    <div className="bg-white min-h-screen p-6">
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-black mb-2">Submitted Data</h1>
          <div className="flex gap-2">
            <button
              onClick={fetchData}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              🔄 Refresh
            </button>
            <button
              onClick={clearData}
              className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800"
            >
              🗑️ Clear
            </button>
            <Link href="/" className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800">
              ➕ Upload
            </Link>
          </div>
        </div>

        {loading && <p className="text-black">Loading...</p>}
        {error && <p className="text-black bg-gray-100 p-3 rounded border border-black">Error: {error}</p>}

        {data && !loading && (
          <>
            {/* Counter */}
            <div className="bg-white p-4 rounded shadow mb-6 border border-gray-300">
              <p className="text-lg font-bold text-black">Total: <span className="text-black">{data.totalSubmissions}</span></p>
            </div>

            {/* Data */}
            {data.totalSubmissions === 0 ? (
              <div className="bg-white p-4 rounded text-black border border-gray-300">
                No data yet. Upload an Excel file first!
              </div>
            ) : (
              <div className="space-y-4">
                {data.data.map((submission, index) => (
                  <div key={submission.id} className="bg-white rounded shadow p-4 border border-gray-300">
                    <div className="mb-3">
                      <h3 className="font-bold text-black">Submission #{index + 1}</h3>
                      <p className="text-sm text-black">{new Date(submission.timestamp).toLocaleString()}</p>
                      <p className="text-sm text-black">Rows: {submission.rowCount}</p>
                    </div>

                    {(() => {
                      const rows = Array.isArray(submission.rows)
                        ? submission.rows
                        : submission.rows
                        ? [submission.rows]
                        : [];
                      if (!rows.length) {
                        return (
                          <div className="bg-white p-3 rounded text-black text-sm border border-gray-300">
                            No rows available for this submission.
                          </div>
                        );
                      }

                      return (
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse text-sm">
                            <thead>
                              <tr className="bg-gray-200">
                                {Object.keys(rows[0]).map((key) => (
                                  <th key={key} className="border border-gray-300 p-2 text-left font-bold text-black">{key}</th>
                                ))}
                              </tr>
                            </thead>
                            <tbody>
                              {rows.map((row, rowIndex) => (
                                <tr key={rowIndex} className="border-t hover:bg-gray-50">
                                  {Object.values(row).map((value, colIndex) => (
                                    <td key={colIndex} className="border border-gray-300 p-2 text-black">{String(value)}</td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      );
                    })()}
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
