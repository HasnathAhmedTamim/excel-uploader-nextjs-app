// Global storage for submitted data
let submittedDataStore = [];

export async function POST(req) {
  try {
    const excelJson = await req.json();
    
    // Store the data with timestamp
    const dataWithTimestamp = {
      id: Date.now(),
      timestamp: new Date().toISOString(),
      rows: excelJson,
      rowCount: Array.isArray(excelJson) ? excelJson.length : 0
    };
    
    submittedDataStore.push(dataWithTimestamp);
    console.log("📥 Data stored in API");
    
    return Response.json({
      success: true,
      message: "Data stored successfully",
      dataId: dataWithTimestamp.id
    });
  } catch (error) {
    return Response.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  return Response.json({
    success: true,
    totalSubmissions: submittedDataStore.length,
    data: submittedDataStore
  });
}

export async function DELETE(req) {
  submittedDataStore = [];
  return Response.json({ success: true, message: "Data cleared" });
}
