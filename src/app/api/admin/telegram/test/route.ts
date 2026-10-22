import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { sendTelegramTestAlert } from "@/lib/telegram";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  try {
    const session = await getSession();
    if (!session || session.role !== "admin") {
      return NextResponse.json({ error: "Forbidden: Admin required" }, { status: 403 });
    }

    const body = await req.json().catch(() => ({}));
    const { token, chatId } = body;

    const result = await sendTelegramTestAlert(token, chatId);

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || "Failed to send test alert" },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      messageId: result.messageId,
      message: "Test notification sent successfully to Telegram!",
    });
  } catch (error: any) {
    console.error("[TELEGRAM TEST ALERT ERROR]", error);
    return NextResponse.json(
      { error: error.message || "Failed to dispatch test notification" },
      { status: 500 }
    );
  }
}
