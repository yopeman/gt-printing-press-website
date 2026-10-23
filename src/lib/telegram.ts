import https from "node:https";
import dns from "node:dns";
import { IQuoteRequest, IContactMessage } from "@/types/database";
import { dbConnect } from "@/lib/db";
import SiteSetting from "@/models/SiteSetting";
import { DEFAULT_SETTINGS } from "@/lib/default-settings";

// Enforce IPv4 resolution to prevent ENETUNREACH / ETIMEDOUT on IPv6-unroutable networks
try {
  dns.setDefaultResultOrder("ipv4first");
} catch (_) {}

export interface TelegramAlertResult {
  success: boolean;
  messageId?: number;
  error?: string;
}

/**
 * Robust IPv4-enforced HTTPS transport for Telegram Bot API
 */
async function postTelegramApi(
  token: string,
  method: string,
  payload: any,
  timeoutMs = 12000
): Promise<{ ok: boolean; result?: any; description?: string }> {
  return new Promise((resolve, reject) => {
    const data = JSON.stringify(payload);
    const req = https.request(
      `https://api.telegram.org/bot${token}/${method}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Content-Length": Buffer.byteLength(data),
        },
        family: 4, // Force IPv4 socket connection
        timeout: timeoutMs,
      },
      (res) => {
        let raw = "";
        res.on("data", (chunk) => (raw += chunk));
        res.on("end", () => {
          try {
            resolve(JSON.parse(raw));
          } catch (e) {
            resolve({ ok: false, description: raw });
          }
        });
      }
    );

    req.on("error", (err) => reject(err));
    req.on("timeout", () => {
      req.destroy();
      reject(new Error("Telegram API request timed out"));
    });

    req.write(data);
    req.end();
  });
}

/**
 * Retrieve Telegram credentials dynamically from MongoDB database first,
 * with fallback to default settings or .env.local
 */
export async function getTelegramCredentials(): Promise<{ token: string; chatId: string }> {
  try {
    await dbConnect();
    const settingsDoc = await SiteSetting.findOne({ key: "general_config" }).lean();
    const config = (settingsDoc as any)?.value;

    const dbToken = config?.telegramBotToken?.trim();
    const dbChatId = config?.telegramChatId?.trim();

    if (dbToken && dbChatId) {
      return { token: dbToken, chatId: dbChatId };
    }
  } catch (err) {
    console.warn("Could not retrieve Telegram credentials from DB:", err);
  }

  // Fallback to DEFAULT_SETTINGS, then process.env
  const fallbackToken =
    DEFAULT_SETTINGS.telegramBotToken || process.env.TELEGRAM_BOT_TOKEN || "";
  const fallbackChatId =
    DEFAULT_SETTINGS.telegramChatId || process.env.TELEGRAM_CHAT_ID || "";

  return { token: fallbackToken, chatId: fallbackChatId };
}

export async function sendTelegramQuoteAlert(
  quote: IQuoteRequest
): Promise<TelegramAlertResult> {
  const { token, chatId } = await getTelegramCredentials();
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

  const serviceName = serviceLabels[quote.serviceType] || quote.serviceType.replace(/-/g, " ");
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
${quote.externalFileUrl ? `🔗 <b>File Share Link:</b> ${escapeHtml(quote.externalFileUrl)}\n` : ""}📎 <b>Attachments:</b> ${fileCount} file(s) attached
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
    const data = await postTelegramApi(token, "sendMessage", {
      chat_id: chatId,
      text: messageText,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    });

    if (!data.ok) {
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

export async function sendTelegramContactAlert(
  contact: IContactMessage
): Promise<TelegramAlertResult> {
  const { token, chatId } = await getTelegramCredentials();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://gtprinting.et";

  if (!token || !chatId || token === "your_bot_token_from_botfather" || token.includes("dummy")) {
    console.warn("⚠️ Telegram Alert: Bot token or Chat ID not configured. Simulated dispatch for reference:", contact.reference);
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
  }).format(new Date(contact.createdAt || Date.now()));

  // Formatted Telegram Alert message (HTML parse mode)
  const messageText = `
📬 <b>New Contact Form Inquiry — GT Printing</b>
<b>Reference:</b> <code>#${escapeHtml(contact.reference)}</code>

👤 <b>Client:</b> ${escapeHtml(contact.name)}
📞 <b>Phone:</b> <code>${escapeHtml(contact.phone)}</code>
${contact.email ? `✉️ <b>Email:</b> ${escapeHtml(contact.email)}\n` : ""}📌 <b>Subject:</b> ${escapeHtml(contact.subject)}

📝 <b>Message:</b>
${escapeHtml(contact.message)}

🌐 <b>Language:</b> ${escapeHtml((contact.locale || "en").toUpperCase())}
🕒 <b>Submitted:</b> ${escapeHtml(submittedAt)} (EAT)
`.trim();

  // Clean phone number for links
  const cleanPhone = contact.phone.replace(/[\s-]/g, "");
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
          text: "🌐 View Website",
          url: siteUrl,
        },
      ],
    ],
  };

  try {
    const data = await postTelegramApi(token, "sendMessage", {
      chat_id: chatId,
      text: messageText,
      parse_mode: "HTML",
      reply_markup: replyMarkup,
    });

    if (!data.ok) {
      console.error("Telegram Bot API Error (Contact):", data);
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
    console.error("Telegram contact notification delivery failure:", error?.message || error);
    return {
      success: false,
      error: error?.message || "Telegram service unreachable",
    };
  }
}

export async function sendTelegramTestAlert(
  customToken?: string,
  customChatId?: string
): Promise<TelegramAlertResult> {
  const creds = await getTelegramCredentials();
  const token = customToken?.trim() || creds.token;
  const chatId = customChatId?.trim() || creds.chatId;

  if (!token || !chatId) {
    return {
      success: false,
      error: "Telegram Bot Token or Chat ID is missing",
    };
  }

  const testMessage = `
✅ <b>Telegram Alert System Verified!</b>
🏢 <b>GT Printing Press (Addis Ababa)</b>

This test dispatch verifies that your Telegram Bot Token and Chat ID stored in the <b>MongoDB database</b> are fully operational and ready to receive production quote requests and contact inquiries.

🕒 <b>Timestamp:</b> ${new Date().toISOString()}
  `.trim();

  try {
    const data = await postTelegramApi(token, "sendMessage", {
      chat_id: chatId,
      text: testMessage,
      parse_mode: "HTML",
    });

    if (!data.ok) {
      return {
        success: false,
        error: data.description || "Failed to deliver Telegram test message",
      };
    }

    return {
      success: true,
      messageId: data.result?.message_id,
    };
  } catch (err: any) {
    return {
      success: false,
      error: err.message || "Telegram service unreachable",
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
