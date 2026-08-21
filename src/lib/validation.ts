import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().trim().min(2, "Enter your name.").max(160),
  email: z.string().trim().email("Enter a valid email address.").max(255),
  phone: z
    .string()
    .trim()
    .max(40)
    .regex(/^[0-9+\-()\s]*$/, "Enter a valid phone number.")
    .optional()
    .or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a little more.").max(4000),
  // Honeypot: real users never fill this hidden field; bots often do.
  website: z.string().max(0, "").optional().or(z.literal("")),
});

export const loginSchema = z.object({
  username: z.string().trim().min(1).max(64),
  password: z.string().min(1).max(200),
  totpCode: z.string().trim().max(10).optional(),
});

export const serviceSchema = z.object({
  title: z.string().trim().min(2).max(160),
  description: z.string().trim().min(2).max(2000),
  icon: z.string().trim().min(1).max(40),
  display_order: z.coerce.number().int().min(0).max(9999),
  published: z.coerce.boolean(),
});

export const testimonialSchema = z.object({
  name: z.string().trim().min(1).max(120),
  role_company: z.string().trim().max(200).optional().or(z.literal("")),
  quote: z.string().trim().min(2).max(2000),
  photo_url: z.string().trim().max(500).optional().or(z.literal("")),
  display_order: z.coerce.number().int().min(0).max(9999),
  published: z.coerce.boolean(),
});

export const blogPostSchema = z.object({
  slug: z
    .string()
    .trim()
    .min(2)
    .max(200)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers, and hyphens only."),
  title: z.string().trim().min(2).max(240),
  excerpt: z.string().trim().max(400).optional().or(z.literal("")),
  content: z.string().trim().min(2),
  cover_image: z.string().trim().max(500).optional().or(z.literal("")),
  meta_title: z.string().trim().max(160).optional().or(z.literal("")),
  meta_description: z.string().trim().max(200).optional().or(z.literal("")),
  tags: z.string().trim().max(300).optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

export const siteSettingsSchema = z.record(z.string(), z.string().max(5000));

export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
