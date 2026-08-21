import { NextRequest, NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validation";
import { createFormSubmission } from "@/lib/content";
import { sendContactNotification } from "@/lib/email";
import { checkRateLimit } from "@/lib/rateLimit";
import { getClientIp } from "@/lib/request";

export async function POST(req: NextRequest) {
  const ip = await getClientIp();

  // Moderate limit: 5 submissions per hour per IP.
  const rl = await checkRateLimit(ip, "contact-form", 5, 60 * 60);
  if (!rl.allowed) {
    return NextResponse.json(
      { error: "Too many submissions. Please try again later." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSeconds) } }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  }

  const parsed = contactFormSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message || "Invalid submission." },
      { status: 400 }
    );
  }

  // Honeypot: if the hidden field has any value, silently pretend success —
  // real bots get no feedback that they were caught.
  if (parsed.data.website) {
    return NextResponse.json({ ok: true });
  }

  const { name, email, phone, message } = parsed.data;

  let emailSent = false;
  try {
    await sendContactNotification({ name, email, phone: phone || null, message });
    emailSent = true;
  } catch (err) {
    console.error("Contact notification email failed:", err);
  }

  await createFormSubmission({
    name,
    email,
    phone: phone || null,
    message,
    ip_address: ip,
    email_sent: emailSent,
  });

  return NextResponse.json({ ok: true });
}
