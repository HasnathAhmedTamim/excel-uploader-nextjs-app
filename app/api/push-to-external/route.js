export async function POST(req) {
  try {
    const excelJson = await req.json();
    
    // 🔍 DEBUG: Log what we received from Excel
    console.log("📥 Raw Excel JSON received:");
    if (Array.isArray(excelJson) && excelJson.length > 0) {
      console.log("  First row keys:", Object.keys(excelJson[0]));
      console.log("  First row data:", JSON.stringify(excelJson[0], null, 2));
    }
    
    const apiUrl = process.env.EXTERNAL_API_URL || "http://103.12.205.81:8890/api/v1/addContactDynamic";
    const userId = process.env.EXTERNAL_USER_ID || "6415f8dd-57aa-42b1-99ce-c025583e8323";

    // Normalize contacts: accept either array of rows or { pico_contact: [...] }
    const toStr = (v) => {
      if (v === undefined || v === null) return "";
      // Handle NaN values from Excel
      if (typeof v === "number" && isNaN(v)) return "";
      let str = String(v).trim();
      // Handle scientific notation ONLY if it matches pattern: digits + E/e + +/- + digits
      // This prevents false positives like "example" being detected as scientific notation
      const scientificRegex = /^\d+\.?\d*[eE][+\-]?\d+$/;
      if (scientificRegex.test(str)) {
        try {
          const num = parseFloat(str);
          if (isNaN(num)) return "";
          str = Math.trunc(num).toString();
        } catch (e) {
          // If conversion fails, keep original
        }
      }
      return str === "NaN" ? "" : str;
    };
    const normalizeContact = (row) => {
      return {
        name: toStr(row.name ?? row.Name ?? row.fullname ?? row.FullName),
        number: toStr(row.number ?? row.Number ?? row.phone ?? row.Phone ?? row.contact ?? row.Contact),
        mail: toStr(row.mail ?? row.Mail ?? row.email ?? row.Email),
        country: toStr(row.country ?? row.Country),
      };
    };

    let picoContacts = [];
    if (Array.isArray(excelJson)) {
      picoContacts = excelJson.map(normalizeContact);
    } else if (excelJson && Array.isArray(excelJson.pico_contact)) {
      picoContacts = excelJson.pico_contact.map(normalizeContact);
    }

    // Drop completely empty rows (no number and no mail) to avoid bad payloads
    picoContacts = picoContacts.filter((c) => c.number || c.mail);

    if (!picoContacts.length) {
      return Response.json({ success: false, message: "No contacts to send" }, { status: 400 });
    }

    const payload = {
      user_id: userId,
      pico_contact: picoContacts,
    };

    console.log("📤 Sending to", apiUrl);
    console.log("Payload:", JSON.stringify(payload, null, 2));

    const response = await fetch(apiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const result = await response.json();
    console.log("✅ Response:", result);

    return Response.json({
      success: true,
      message: "Data sent to external API",
      externalResponse: result,
      sentContacts: picoContacts,
      sentCount: picoContacts.length,
    });
  } catch (error) {
    console.error("❌ Error:", error);
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
