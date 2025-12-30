export async function POST(req) {
  const data = await req.json();

  console.log("Excel JSON Data:", data);

  return Response.json({
    message: "Data received",
    rows: data.length,
    data,
  });
}
