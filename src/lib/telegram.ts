import { IQuoteRequest } from "@/types/database";

interface TelegramAlertResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

export async function sendTelegramQuoteAlert(
  quote: IQuoteRequest
): Promise<TelegramAlertResult> {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtprinting.et";

  if (!token || !chatId || token === "your_bot_token_from_botfather" || token.includes("dummy")) {
    console.warn("⚠️ Telegram Alert: Bot token or Chat ID not configured. Simulated dispatch for reference:", quote.reference);
    return {
      success: true,
      messageId: 1000,
      error: "Simulated in development mode",
    };
  }

  // Format submission date in East Africa Time (UTC+3)
  const submittedAt = new Intl.DateTimeFormat("en-US", {
    timeZone: "Africa/Addis_Ababa",
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(quote.createdAt || Date.now()));

  // Service name mapping
  const serviceLabels: Record<string, string> = {
    "offset-digital-printing": "Offset & Digital Printing",
    "publishing-binding": "Publishing & Binding",
    "packaging-solutions": "Packaging Solutions",
    "large-format-signage": "Large Format & Signage",
    "graphic-design-prepress": "Graphic Design & Pre-Press",
    "corporate-promotional-items": "Corporate & Promotional Items",
    other: "Other / Custom",
  };

  const serviceName = serviceLabels[quote.serviceType] || quote.serviceType;
  const fileCount = quote.attachments ? quote.attachments.length : 0;
  const artworkStatusLabel =
    quote.artworkStatus === "ready"
      ? "Ready to Print"
      : "Need Design Assistance";

  // Formatted Telegram Alert message (HTML parse mode)
  const messageText = `
🚀 <b>New Quote Request — GT Printing</b>
<b>Reference:</b> <code>#${escapeHtml(quote.reference)}</code>

🛠 <b>Service:</b> ${escapeHtml(serviceName)}
👤 <b>Client:</b> ${escapeHtml(quote.name)}
${quote.company ? `🏢 <b>Company:</b> ${escapeHtml(quote.company)}\n` : ""}📞 <b>Phone:</b> <code>${escapeHtml(quote.phone)}</code>
${quote.email ? `✉️ <b>Email:</b> ${escapeHtml(quote.email)}\n` : ""}💬 <b>Preferred Contact:</b> ${escapeHtml(quote.preferredContact.toUpperCase())}

📝 <b>Specifications:</b>
${escapeHtml(quote.specification)}

${quote.quantity ? `📦 <b>Quantity:</b> ${escapeHtml(quote.quantity)}\n` : ""}${quote.neededBy ? `📅 <b>Needed By:</b> ${escapeHtml(quote.neededBy)}\n` : ""}🎨 <b>Artwork Status:</b> ${escapeHtml(artworkStatusLabel)}
📎 <b>Attachments:</b> ${fileCount} file(s) attached
🌐 <b>Language:</b> ${escapeHtml(quote.locale.toUpperCase())}
🕒 <b>Submitted:</b> ${escapeHtml(submittedAt)} (EAT)
`.trim();

  // Clean phone number for links
  const cleanPhone = quote.phone.replace(/[\s-]/g, "");
  const telegramPhone = cleanPhone.startsWith("+")
    ? cleanPhone.slice(1)
    : cleanPhone.startsWith("0")
    ? `251${cleanPhone.slice(1)}`
    : cleanPhone;

  // Inline action buttons
  const replyMarkup = {
    inline_keyboard: [
      [
        {
          text: "💬 Chat on Telegram",
          url: `https://t.me/+${telegramPhone}`,
        },
        {
          text: "📂 Open Admin",
          url: `${siteUrl}/admin/quotes`,
        },
      ],
    ],
  };

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text: messageText,
        parse_mode: "HTML",
        reply_markup: replyMarkup,
      }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    const data = await response.json();

    if (!response.ok || !data.ok) {
      console.error("Telegram Bot API Error:", data);
      return {
        success: false,
        error: data.description || "Failed to deliver Telegram notification",
      };
    }

    return {
      success: true,
      messageId: data.result?.message_id,
    };
  } catch (error: any) {
    console.error("Telegram notification delivery failure:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Telegram service unreachable",
    };
  }
}

function escapeHtml(text: string): string {
  if (!text) return "";
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
