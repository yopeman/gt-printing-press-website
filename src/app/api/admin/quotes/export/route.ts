import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import QuoteRequest from "@/models/QuoteRequest";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await dbConnect();
    const quotes = await QuoteRequest.find().sort({ createdAt: -1 }).lean();

    const headers = [
      "Reference",
      "Date",
      "Customer Name",
      "Company",
      "Phone",
      "Email",
      "Service Type",
      "Quantity",
      "Needed By",
      "Artwork Status",
      "Status",
      "Telegram Sent",
      "Notes",
    ];

    const escapeCsv = (str: any) => {
      if (str === null || str === undefined) return '""';
      const text = String(str).replace(/"/g, '""');
      return `"${text}"`;
    };

    const rows = quotes.map((q) => [
      escapeCsv(q.reference),
      escapeCsv(new Date(q.createdAt).toISOString().split("T")[0]),
      escapeCsv(q.name),
      escapeCsv(q.company || ""),
      escapeCsv(q.phone),
      escapeCsv(q.email || ""),
      escapeCsv(q.serviceType),
      escapeCsv(q.quantity || ""),
      escapeCsv(q.neededBy || ""),
      escapeCsv(q.artworkStatus || ""),
      escapeCsv(q.status),
      escapeCsv(q.telegramDeliveryStatus === "sent" ? "YES" : "NO"),
      escapeCsv(q.notes || ""),
    ]);

    const csvContent = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");

    return new NextResponse(csvContent, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="gt-quotes-export-${new Date().toISOString().split("T")[0]}.csv"`,
      },
    });
  } catch (error: any) {
    console.error("[ADMIN QUOTES CSV EXPORT ERROR]", error);
    return NextResponse.json({ error: "Failed to export CSV" }, { status: 500 });
  }
}
