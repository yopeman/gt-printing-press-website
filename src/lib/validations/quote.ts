import { z } from "zod";

// Flexible phone validation regex allowing Ethiopian mobile/landlines and international formats
export const ethiopianPhoneRegex = /^(\+?251|0)?[1-9]\d{7,10}$/;

export const QuoteSubmissionSchema = z.object({
  serviceType: z.string().trim().min(1, "Please select a service type"),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().trim().max(120).optional().default(""),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s\-()]/g, ""))
    .refine((val) => ethiopianPhoneRegex.test(val), {
      message: "Please enter a valid phone number (e.g., +251 91 123 4567, 0911234567, or 0115512345)",
    }),
  email: z.string().trim().email("Please enter a valid email address").or(z.literal("")).optional().default(""),
  preferredContact: z.enum(["phone", "telegram", "email"]).default("phone"),
  specification: z.string().trim().min(5, "Please provide job details (min 5 characters)"),
  quantity: z.string().trim().optional().default(""),
  neededBy: z.string().trim().optional().default(""),
  artworkStatus: z.enum(["ready", "need_help"]).default("ready"),
  locale: z.enum(["en", "am", "om"]).default("en"),
  attachments: z
    .array(
      z.object({
        fileName: z.string(),
        fileUrl: z.string(),
        size: z.number(),
      })
    )
    .optional()
    .default([]),
  externalFileUrl: z.string().trim().url().or(z.literal("")).optional().default(""),
  // Honeypot field: must be empty
  website_honey: z.string().max(0, "Bot detected").optional().default(""),
});

export type QuoteSubmissionInput = z.infer<typeof QuoteSubmissionSchema>;
