import { z } from "zod";
import { ethiopianPhoneRegex } from "./quote";

export const ContactSubmissionSchema = z.object({
  name: z.string().trim().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .trim()
    .transform((val) => val.replace(/[\s-]/g, ""))
    .refine(
      (val) => ethiopianPhoneRegex.test(val) || /^\+?[1-9]\d{7,14}$/.test(val),
      {
        message: "Please enter a valid phone number (e.g., +251 91 123 4567 or 0911234567)",
      }
    ),
  email: z
    .string()
    .trim()
    .email("Please enter a valid email address")
    .or(z.literal(""))
    .optional()
    .default(""),
  subject: z.string().trim().min(2, "Subject must be at least 2 characters").max(150),
  message: z.string().trim().min(5, "Message must be at least 5 characters").max(3000),
  locale: z.enum(["en", "am", "om"]).optional().default("en"),
  // Honeypot field: must be empty
  website_honey: z.string().max(0, "Bot detected").optional().default(""),
});

export type ContactSubmissionInput = z.infer<typeof ContactSubmissionSchema>;
