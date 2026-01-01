export async function GET(req) {
  try {
    const userId = process.env.EXTERNAL_USER_ID || "6415f8dd-57aa-42b1-99ce-c025583e8323";
    const externalUrl = `http://103.12.205.81:8890/api/v1/userContacts?userID=${userId}`;

    console.log("📥 Fetching contacts from:", externalUrl);

    const response = await fetch(externalUrl);
    
    if (!response.ok) {
      throw new Error(`External API error: ${response.status}`);
    }

    const data = await response.json();
    console.log("✅ Fetched contacts:", data);

    return Response.json({
      success: true,
      data: Array.isArray(data) ? data : [],
      count: Array.isArray(data) ? data.length : 0,
    });
  } catch (error) {
    console.error("❌ Error fetching contacts:", error);
    return Response.json(
      {
        success: false,
        message: "Failed to fetch contacts",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
