import ExcelUploader from "@/components/ExcelUploader";

export default function Home() {
  return (
    <main style={{ padding: "20px", maxWidth: "900px", margin: "0 auto", fontFamily: "Arial, sans-serif" }}>
      <h1>📊 Excel to API Upload</h1>
      <p>Upload an Excel file with contact info (name, number, mail, country) and push to the external API.</p>
      <ExcelUploader />
    </main>
  );
}
