import { NextRequest, NextResponse } from "next/server";
import { ContactSubmissionSchema } from "@/lib/validations/contact";
import { checkRateLimit } from "@/lib/rate-limit";
import { sendTelegramContactAlert } from "@/lib/telegram";
import connectToDatabase from "@/lib/db";
import { ContactMessage } from "@/models/ContactMessage";
import { IContactMessage, Locale } from "@/types/database";

export async function POST(req: NextRequest) {
  // 1. IP Rate Limiting Check
  const forwarded = req.headers.get("x-forwarded-for");
  const ip = forwarded ? forwarded.split(",")[0].trim() : "127.0.0.1";

  const rateCheck = checkRateLimit(`contact_${ip}`, 10, 10 * 60 * 1000);
  if (!rateCheck.success) {
    return NextResponse.json(
      {
        success: false,
        error: "Too many contact messages from this IP. Please wait 10 minutes or call our desk directly.",
      },
      { status: 429 }
    );
  }

  try {
    const rawBody = await req.json();

    // 2. Validate input schema with Zod & check honeypot
    const parseResult = ContactSubmissionSchema.safeParse(rawBody);
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
    const reference = `GT-MSG-${randomSuffix}`;

    // 4. Save to Database
    let savedMessageId: string = "";
    let contactDocument: IContactMessage = {
      reference,
      name: data.name,
      email: data.email || "",
      phone: data.phone,
      subject: data.subject,
      message: data.message,
      locale: (data.locale || "en") as Locale,
      status: "New",
      telegramDeliveryStatus: "pending",
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    try {
      await connectToDatabase();
      const doc = await ContactMessage.create(contactDocument);
      savedMessageId = doc._id ? doc._id.toString() : "";
      contactDocument = doc.toObject();
    } catch (dbErr: any) {
      console.warn("MongoDB connection unavailable; continuing with Telegram notification dispatch:", dbErr?.message);
    }

    // 5. Instant Dispatch to Telegram
    const telegramResult = await sendTelegramContactAlert(contactDocument);

    // 6. Update Telegram status in DB if saved
    if (savedMessageId) {
      try {
        await ContactMessage.findByIdAndUpdate(savedMessageId, {
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
        messageId: savedMessageId || reference,
        telegramDelivered: telegramResult.success,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Contact Submission Endpoint Error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to process contact inquiry",
      },
      { status: 500 }
    );
  }
}
