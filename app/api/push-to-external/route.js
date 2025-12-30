export async function GET(req) {
  return Response.json({
    success: true,
    message: "✅ API is working (GET)",
    rowsProcessed: 0,
    note: "Send POST request with Excel data to upload",
  });
}

export async function POST(req) {
  try {
    console.log("📥 Received request to /api/push-to-external");
    
    // 1️⃣ Read Excel JSON from frontend
    let excelJson;
    try {
      excelJson = await req.json();
      console.log("✅ JSON parsed successfully:", excelJson);
    } catch (e) {
      console.error("❌ Failed to parse JSON:", e.message);
      return Response.json(
        {
          success: false,
          message: "Failed to parse request body",
          error: e.message,
        },
        { status: 400 }
      );
    }

    // 2️⃣ Get API details from environment variables
    const apiUrl = process.env.EXTERNAL_API_URL;
    const apiKey = process.env.EXTERNAL_API_KEY;

    console.log("🔧 Config - API URL:", apiUrl ? "Set" : "Not set");

    // If no API configured, return mock success for testing
    if (!apiUrl || apiUrl.includes("localhost:3000/api/mock")) {
      console.log("✅ Returning mock response (no external API configured)");
      return Response.json({
        success: true,
        message: "✅ Data received successfully (mock mode)",
        rowsProcessed: Array.isArray(excelJson) ? excelJson.length : 0,
        mockData: excelJson,
      });
    }

    console.log(`📤 Sending ${Array.isArray(excelJson) ? excelJson.length : "?"} rows to: ${apiUrl}`);

    // 3️⃣ Send data to external API
    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(apiKey && { "Authorization": `Bearer ${apiKey}` }),
      },
      body: JSON.stringify({
        data: excelJson,
      }),
    });

    // Check if response is ok
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API returned ${response.status}: ${errorText}`);
    }

    // 4️⃣ Read their response
    const result = await response.json();
    console.log("✅ External API response:", result);

    // 5️⃣ Send response back to frontend
    return Response.json({
      success: true,
      message: "Data sent to external API",
      externalResponse: result,
    });
  } catch (error) {
    console.error("❌ Error in POST /api/push-to-external:", error.message);
    console.error("Stack:", error.stack);
    
    return Response.json(
      {
        success: false,
        message: "Failed to send data",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
