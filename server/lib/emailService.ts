import nodemailer from "nodemailer";

// SMTP configuration
const SMTP_CONFIG = {
  host: process.env.SMTP_HOST || "smtp.hostinger.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASSWORD || "",
  },
};

// Check if SMTP is configured
const SMTP_ENABLED = Boolean(
  process.env.SMTP_HOST &&
    process.env.SMTP_USER &&
    process.env.SMTP_PASSWORD
);

// Create transporter
let transporter: nodemailer.Transporter | null = null;

if (SMTP_ENABLED) {
  transporter = nodemailer.createTransport(SMTP_CONFIG);
}

/**
 * Send email
 */
export async function sendEmail(
  to: string,
  subject: string,
  html: string,
  text?: string
): Promise<boolean> {
  if (!SMTP_ENABLED || !transporter) {
    console.warn("SMTP not configured, email not sent:", { to, subject });
    return false;
  }

  try {
    const info = await transporter.sendMail({
      from: process.env.SMTP_FROM || SMTP_CONFIG.auth.user,
      to,
      subject,
      text: text || html.replace(/<[^>]*>/g, ""), // Strip HTML for text version
      html,
    });

    console.log("Email sent:", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email:", error);
    return false;
  }
}

/**
 * Send admin notification for new order
 */
export async function sendOrderNotification(
  order: {
    id: string;
    artworkId?: string;
    orderType: string;
    contactInfo: {
      name: string;
      email: string;
      phone?: string;
      message?: string;
    };
    artworkTitle?: string;
  }
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "info@plankjesmaffia.nl";

  const orderTypeLabels: Record<string, string> = {
    original: "Origineel werk",
    derivative: "Afgeleide versie",
    tshirt: "T-shirt print",
    custom: "Custom origineel",
    mug: "Mok print",
    notebook: "Notebook print",
    poster: "Poster print",
    canvas: "Canvas print",
    sticker: "Sticker print",
    "tote-bag": "Tote bag print",
  };

  const subject = `Nieuwe order aanvraag: ${order.artworkTitle || "Kunstwerk"} - ${orderTypeLabels[order.orderType] || order.orderType}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nieuwe Order Aanvraag</h1>
        </div>
        <div class="content">
          <div class="info-row">
            <span class="label">Order ID:</span> ${order.id}
          </div>
          <div class="info-row">
            <span class="label">Kunstwerk:</span> ${order.artworkTitle || "Niet gespecificeerd"}
          </div>
          <div class="info-row">
            <span class="label">Type:</span> ${orderTypeLabels[order.orderType] || order.orderType}
          </div>
          <div class="info-row">
            <span class="label">Naam:</span> ${order.contactInfo.name}
          </div>
          <div class="info-row">
            <span class="label">Email:</span> <a href="mailto:${order.contactInfo.email}">${order.contactInfo.email}</a>
          </div>
          ${order.contactInfo.phone ? `<div class="info-row"><span class="label">Telefoon:</span> ${order.contactInfo.phone}</div>` : ""}
          ${order.contactInfo.message ? `<div class="info-row"><span class="label">Bericht:</span><br>${order.contactInfo.message.replace(/\n/g, "<br>")}</div>` : ""}
        </div>
        <div class="footer">
          <p>Dit is een automatische notificatie van het Zaanse Plankjes Maffia systeem.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(adminEmail, subject, html);
}

/**
 * Send newsletter confirmation email
 */
export async function sendNewsletterConfirmation(
  email: string,
  name?: string
): Promise<boolean> {
  const subject = "Welkom bij de Zaanse Plankjes Maffia nieuwsbrief!";

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Welkom bij de Nieuwsbrief!</h1>
        </div>
        <div class="content">
          <p>Beste ${name || "klant"},</p>
          <p>Bedankt voor je inschrijving op de nieuwsbrief van De Zaanse Plankjes Maffia!</p>
          <p>Je ontvangt nu updates over nieuwe kunstwerken, exclusieve aanbiedingen en workshops.</p>
          <p>Met vriendelijke groet,<br>Het team van De Zaanse Plankjes Maffia</p>
        </div>
        <div class="footer">
          <p>Je kunt je op elk moment uitschrijven door te antwoorden op deze email.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(email, subject, html);
}

/**
 * Send contact form notification to admin
 */
export async function sendContactNotification(
  submission: {
    name: string;
    email: string;
    subject?: string;
    message: string;
  }
): Promise<boolean> {
  const adminEmail = process.env.ADMIN_EMAIL || "info@plankjesmaffia.nl";
  const subject = `Nieuw contactformulier bericht${submission.subject ? `: ${submission.subject}` : ""}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background-color: #000; color: #fff; padding: 20px; text-align: center; }
        .content { background-color: #f9f9f9; padding: 20px; margin-top: 20px; }
        .info-row { margin: 10px 0; }
        .label { font-weight: bold; }
        .message { background-color: #fff; padding: 15px; margin-top: 15px; border-left: 4px solid #000; }
        .footer { margin-top: 20px; padding-top: 20px; border-top: 1px solid #ddd; font-size: 12px; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h1>Nieuw Contactformulier Bericht</h1>
        </div>
        <div class="content">
          <div class="info-row">
            <span class="label">Naam:</span> ${submission.name}
          </div>
          <div class="info-row">
            <span class="label">Email:</span> <a href="mailto:${submission.email}">${submission.email}</a>
          </div>
          ${submission.subject ? `<div class="info-row"><span class="label">Onderwerp:</span> ${submission.subject}</div>` : ""}
          <div class="message">
            <span class="label">Bericht:</span><br>
            ${submission.message.replace(/\n/g, "<br>")}
          </div>
        </div>
        <div class="footer">
          <p>Dit is een automatische notificatie van het Zaanse Plankjes Maffia systeem.</p>
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail(adminEmail, subject, html);
}

