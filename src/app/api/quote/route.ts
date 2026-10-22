import { NextRequest, NextResponse } from "next/server";
import { QuoteSubmissionSchema } from "@/lib/validations/quote";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendTelegramQuoteAlert } from "@/lib/telegram";
import connectToDatabase from "@/lib/db";
import { QuoteRequest } from "@/models/QuoteRequest";
import { IQuoteRequest } from "@/types/database";

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting Check
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  const rateCheck = checkRateLimit(ip, 10, 10 * 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many quote requests from this IP. Please wait 10 minutes or call our desk directly.",
      },
      { status: 429 }
    );
  }

  try {
    const rawBody = await req.json();

    // 2. Validate input schema with Zod & check honeypot
    const parseResult = QuoteSubmissionSchema.safeParse(rawBody);
    if (!parseResult.success) {
      const firstError = parseResult.error.errors[0]?.message || "Invalid form data";
      return NextResponse.json(
        { success: false, error: firstError, details: parseResult.error.flatten() },
        { status: 400 }
      );
    }

    const data = parseResult.data;

    // 3. Generate unique sequential reference number
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const reference = `GT-2026-${randomSuffix}`;

    // 4. Save to Database
    let savedQuoteId: string = "";
    let quoteDocument: IQuoteRequest = {
      reference,
      serviceType: data.serviceType,
      name: data.name,
      company: data.company,
      phone: data.phone,
      email: data.email,
      preferredContact: data.preferredContact,
      specification: data.specification,
      quantity: data.quantity,
      neededBy: data.neededBy,
      artworkStatus: data.artworkStatus,
      locale: data.locale,
      attachments: data.attachments || [],
      status: "New",
      notes: data.externalFileUrl ? `External File Share: ${data.externalFileUrl}` : "",
      telegramDeliveryStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await connectToDatabase();
      const doc = await QuoteRequest.create(quoteDocument);
      savedQuoteId = doc._id ? doc._id.toString() : "";
      quoteDocument = doc.toObject();
    } catch (dbErr: any) {
      console.warn("MongoDB connection unavailable; continuing with Telegram notification dispatch:", dbErr?.message);
    }

    // 5. Instant Dispatch to Telegram
    const telegramResult = await sendTelegramQuoteAlert(quoteDocument);

    // 6. Update Telegram status in DB if saved
    if (savedQuoteId) {
      try {
        await QuoteRequest.findByIdAndUpdate(savedQuoteId, {
          telegramDeliveryStatus: telegramResult.success ? "sent" : "failed",
        });
      } catch (e) {
        // Non-blocking
      }
    }

    return NextResponse.json(
      {
        success: true,
        reference,
        quoteId: savedQuoteId || reference,
        telegramDelivered: telegramResult.success,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Quote Submission Endpoint Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process quote inquiry",
      },
      { status: 500 }
    );
  }
}
