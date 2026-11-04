const express = require("express");
const { createTransporter } = require("../mailer");

const router = express.Router();

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post("/", async (req, res) => {
  const { name, phone, email, message } = req.body;

  // ── Validation ──────────────────────────────────────────────────────────────
  if (!name?.trim() || !phone?.trim() || !email?.trim()) {
    return res
      .status(400)
      .json({ error: "Name, phone, and email are required." });
  }
  if (!EMAIL_REGEX.test(email)) {
    return res.status(400).json({ error: "Invalid email address." });
  }

  try {
    const transporter = await createTransporter();

    const now = new Date();
    const timestamp = now.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });

    const f = "'IBM Plex Sans', Arial, 'Helvetica Neue', sans-serif";
    const gFont = `@import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@300;400;500&display=swap');`;

    // ── Notification email (to you) ──────────────────────────────────────────
    const notificationMail = {
      from: `"Content Prompts" <${process.env.EMAIL_FROM}>`,
      to: process.env.EMAIL_TO,
      replyTo: email,
      subject: `New Lead: ${name}`,
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>${gFont}</style>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:${f};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

        <!-- Wordmark -->
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-size:12px;font-weight:300;letter-spacing:0.3em;color:#9E9E9E;text-transform:uppercase;font-family:${f};">CONTENT</p>
          <p style="margin:1px 0 0;font-size:30px;font-weight:500;letter-spacing:0.06em;color:#f5f5f5;text-transform:uppercase;line-height:1;font-family:${f};">PROMPTS</p>
        </td></tr>

        <!-- Name -->
        <tr><td style="padding-bottom:10px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="background-color:#1c1c1c;padding:12px 16px;border-radius:4px;">
              <p style="margin:0 0 3px;font-size:11px;font-weight:500;letter-spacing:0.1em;color:#555;font-family:${f};">Your Name</p>
              <p style="margin:0;font-size:14px;font-weight:300;letter-spacing:0.05em;color:#e8e6da;font-family:${f};">${name}</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- Phone -->
        <tr><td style="padding-bottom:10px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="background-color:#1c1c1c;padding:12px 16px;border-radius:4px;">
              <p style="margin:0 0 3px;font-size:11px;font-weight:500;letter-spacing:0.1em;color:#555;font-family:${f};">Phone Number</p>
              <p style="margin:0;font-size:14px;font-weight:500;letter-spacing:0.05em;color:#e8e6da;font-family:${f};">${phone}</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- Email -->
        <tr><td style="padding-bottom:10px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="background-color:#1c1c1c;padding:12px 16px;border-radius:4px;">
              <p style="margin:0 0 3px;font-size:11px;font-weight:500;letter-spacing:0.1em;color:#555;font-family:${f};">Email Address</p>
              <a href="mailto:${email}" style="display:block;margin:0;font-size:14px;font-weight:500;letter-spacing:0.05em;color:#e8e6da;text-decoration:none;font-family:${f};">${email}</a>
            </td>
          </tr></table>
        </td></tr>

        <!-- Message -->
        <tr><td style="padding-bottom:10px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="background-color:#1c1c1c;padding:12px 16px;border-radius:4px;">
              <p style="margin:0 0 3px;font-size:11px;font-weight:500;letter-spacing:0.05em;color:#555;font-family:${f};">Your Message</p>
              <p style="margin:0;font-size:14px;letter-spacing:0.1em;font-weight:500;color:${message ? "#e8e6da" : "#3a3a3a"};font-family:${f};line-height:1.6;white-space:pre-wrap;">${message || "No message provided."}</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="text-align:center;padding:14px 0;">
          <a href="mailto:${email}" style="font-family:${f};font-size:11px;font-weight:300;letter-spacing:0.22em;text-transform:uppercase;color:#f5f5f5;text-decoration:none;">[&nbsp;&nbsp;Reply to ${name}&nbsp;&nbsp;]</a>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:24px;">
          <p style="margin:0;font-size:11px;font-weight:300;color:#D7D6D6;letter-spacing:0.06em;font-family:${f};">
            Received ${timestamp} IST &nbsp;·&nbsp; <a href="https://contentprompts.pro" style="color:#f5f5f5;text-decoration:none;">contentprompts.pro</a>
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    };

    // ── Auto-reply (to the user) ─────────────────────────────────────────────
    const autoReplyMail = {
      from: `"Content Prompts" <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "We got your message — Content Prompts",
      html: `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1.0"/>
  <style>${gFont}</style>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:${f};">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:40px 20px;">
    <tr><td align="center">
      <table width="520" cellpadding="0" cellspacing="0" style="max-width:520px;width:100%;">

        <!-- Wordmark -->
        <tr><td style="padding-bottom:32px;">
          <p style="margin:0;font-size:10px;font-weight:300;letter-spacing:0.3em;color:#9E9E9E;text-transform:uppercase;font-family:${f};">CONTENT</p>
          <p style="margin:1px 0 0;font-size:28px;font-weight:500;letter-spacing:0.06em;color:#f5f5f5;text-transform:uppercase;line-height:1;font-family:${f};">PROMPTS</p>
        </td></tr>

        <!-- Message block -->
        <tr><td style="padding-bottom:10px;">
          <table width="100%" cellpadding="0" cellspacing="0"><tr>
            <td style="background-color:#1c1c1c;padding:20px 18px;border-radius:3px;">
              <p style="margin:0 0 14px;font-size:14px;font-weight:300;color:#e8e6da;line-height:1.7;font-family:${f};">Hey ${name}, your message reached us.</p>
              <p style="margin:0 0 14px;font-size:13px;font-weight:300;color:#666;line-height:1.7;font-family:${f};">We'll review it and get back to you within one business day. If it's urgent, reply to this email directly.</p>
              <p style="margin:0;font-size:13px;font-weight:300;color:#666;line-height:1.7;font-family:${f};">Content Prompts is a full-funnel digital marketing agency built for brands that want to grow — not just show up. Strategy, content, SEO, and performance — all under one roof.</p>
            </td>
          </tr></table>
        </td></tr>

        <!-- CTA -->
        <tr><td style="text-align:center;padding:14px 0;">
          <a href="https://contentprompts.pro" style="font-family:${f};font-size:11px;font-weight:300;letter-spacing:0.22em;text-transform:uppercase;color:#f5f5f5;text-decoration:none;">[&nbsp;&nbsp;Visit Our Website&nbsp;&nbsp;]</a>
        </td></tr>

        <!-- Social icons -->
        <tr><td style="padding-top:24px;">
          <p style="margin:0 0 12px;font-size:9px;font-weight:300;letter-spacing:0.1em;text-transform:uppercase;color:#666;font-family:${f};">Follow Us</p>
          <table cellpadding="0" cellspacing="0"><tr>
            <td style="padding-right:8px;">
              <a href="https://www.linkedin.com/company/content-prompts/home/" style="display:inline-block;width:32px;height:32px;background-color:#1c1c1c;border-radius:50%;border:1px solid rgba(245,245,245,0.15);text-align:center;line-height:32px;text-decoration:none;font-family:${f};font-size:12px;font-weight:700;color:#777777;" title="LinkedIn">in</a>
            </td>
            <td style="padding-right:8px;">
              <a href="https://www.facebook.com/people/Content-Prompts/100063965808672/" style="display:inline-block;width:32px;height:32px;background-color:#1c1c1c;border-radius:50%;border:1px solid rgba(245,245,245,0.15);text-align:center;line-height:32px;text-decoration:none;font-family:${f};font-size:13px;font-weight:700;color:#777777;" title="Facebook">f</a>
            </td>
            <td style="padding-right:8px;">
              <a href="https://www.instagram.com/contentpromptspro" style="display:inline-block;width:32px;height:32px;background-color:#1c1c1c;border-radius:50%;border:1px solid rgba(245,245,245,0.15);text-align:center;line-height:32px;text-decoration:none;font-family:${f};font-size:11px;font-weight:700;color:#777777;" title="Instagram">ig</a>
            </td>
            <td>
              <a href="https://www.youtube.com/@contentprompts" style="display:inline-block;width:32px;height:32px;background-color:#1c1c1c;border-radius:50%;border:1px solid rgba(245,245,245,0.15);text-align:center;line-height:32px;text-decoration:none;font-family:${f};font-size:11px;font-weight:700;color:#777777;" title="YouTube">yt</a>
            </td>
          </tr></table>
        </td></tr>

        <!-- Footer -->
        <tr><td style="padding-top:20px;">
          <p style="margin:0;font-size:10px;font-weight:300;color:#444;letter-spacing:0.06em;font-family:${f};">
            &copy; ${now.getFullYear()} Content Prompts &nbsp;&middot;&nbsp; <a href="https://contentprompts.pro" style="color:#444;text-decoration:none;">contentprompts.pro</a>
          </p>
          <p style="margin:4px 0 0;font-size:10px;font-weight:300;color:#444;font-family:${f};">
            You're receiving this because you submitted a contact form on our website.
          </p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
    };

    // Send both in parallel
    await Promise.all([
      transporter.sendMail(notificationMail),
      transporter.sendMail(autoReplyMail),
    ]);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[POST /api/contact] Error sending email:", err);
    return res
      .status(500)
      .json({ error: "Failed to send email. Please try again later." });
  }
});

module.exports = router;
