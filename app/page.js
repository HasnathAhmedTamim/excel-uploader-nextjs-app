import ExcelUploader from "@/components/ExcelUploader";
import Link from "next/link";

export default function Home() {
  return (
    <main className="bg-white text-black p-4 min-h-screen">
      <h1 className="text-center font-bold">Excel Upload App</h1>
      <div style={{ marginBottom: "20px" }}>
        <Link href="/submitted-data" className="px-4 py-2 rounded underline">
          📊 View All Submissions
        </Link>
      </div>
      <ExcelUploader></ExcelUploader>
    </main>
  );
}
