import { z } from "zod";

// Ethiopian phone number validation regex:
// Valid formats: +251 9XXXXXXXX, +251 7XXXXXXXX, 09XXXXXXXX, 07XXXXXXXX (with optional spaces/dashes)
export const ethiopianPhoneRegex = /^(\+251|0)(9|7)\d{8}$/;

export const QuoteSubmissionSchema = z.object({
  serviceType: z.enum([
    "offset-digital-printing",
    "publishing-binding",
    "packaging-solutions",
    "large-format-signage",
    "graphic-design-prepress",
    "corporate-promotional-items",
    "other",
  ]),
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  company: z.string().trim().max(120).optional().default(""),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine((val) => ethiopianPhoneRegex.test(val), {
      message: "Please enter a valid Ethiopian mobile number (e.g., +251 91 123 4567 or 0911234567)",
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
