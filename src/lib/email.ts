import nodemailer from "nodemailer";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT || 465),
      secure: Number(process.env.SMTP_PORT || 465) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }
  return transporter;
}

function escapeHtml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/**
 * Sends a plain internal notification when the contact form is submitted.
 * This is the ONLY use of outbound email in the app — no marketing or bulk
 * sending, matching the domain mailbox's intended purpose.
 */
export async function sendContactNotification(entry: {
  name: string;
  email: string;
  phone?: string | null;
  message: string;
}): Promise<void> {
  const to = process.env.CONTACT_TO_EMAIL || process.env.SMTP_USER;
  const from = process.env.SMTP_FROM || process.env.SMTP_USER;

  await getTransporter().sendMail({
    from,
    to,
    replyTo: entry.email,
    subject: `New enquiry from ${entry.name} — Investory contact form`,
    text: [
      `Name: ${entry.name}`,
      `Email: ${entry.email}`,
      entry.phone ? `Phone: ${entry.phone}` : null,
      "",
      "Message:",
      entry.message,
    ]
      .filter(Boolean)
      .join("\n"),
    html: `
      <div style="font-family:sans-serif;font-size:15px;line-height:1.6;color:#102624">
        <p><strong>New enquiry from the Investory website</strong></p>
        <p><strong>Name:</strong> ${escapeHtml(entry.name)}<br/>
        <strong>Email:</strong> ${escapeHtml(entry.email)}<br/>
        ${entry.phone ? `<strong>Phone:</strong> ${escapeHtml(entry.phone)}<br/>` : ""}</p>
        <p><strong>Message:</strong></p>
        <p>${escapeHtml(entry.message).replace(/\n/g, "<br/>")}</p>
      </div>
    `,
  });
}
