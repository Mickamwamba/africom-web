import { Resend } from "resend";

export interface InquiryFormData {
  name: string;
  organization?: string;
  email: string;
  serviceOfInterest: "export" | "consultation" | "other";
  message: string;
}

const serviceLabels: Record<InquiryFormData["serviceOfInterest"], string> = {
  export: "Export Products",
  consultation: "Consultation Services",
  other: "General Inquiry",
};

export async function sendInquiryEmail(
  data: InquiryFormData
): Promise<{ success: boolean; error?: string }> {
  const apiKey = process.env.RESEND_API_KEY;
  const contactEmail = process.env.CONTACT_EMAIL;

  if (!apiKey || !contactEmail) {
    return { success: false, error: "Email service not configured" };
  }

  const resend = new Resend(apiKey);

  const subject = `New Inquiry: ${serviceLabels[data.serviceOfInterest]} — ${data.name}`;

  const html = `
    <h2>New Website Inquiry</h2>
    <table style="border-collapse:collapse;width:100%;max-width:600px">
      <tr>
        <td style="padding:8px;font-weight:bold;border:1px solid #ddd;background:#f5f5f5">Name</td>
        <td style="padding:8px;border:1px solid #ddd">${escapeHtml(data.name)}</td>
      </tr>
      ${
        data.organization
          ? `<tr>
        <td style="padding:8px;font-weight:bold;border:1px solid #ddd;background:#f5f5f5">Organisation</td>
        <td style="padding:8px;border:1px solid #ddd">${escapeHtml(data.organization)}</td>
      </tr>`
          : ""
      }
      <tr>
        <td style="padding:8px;font-weight:bold;border:1px solid #ddd;background:#f5f5f5">Email</td>
        <td style="padding:8px;border:1px solid #ddd"><a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></td>
      </tr>
      <tr>
        <td style="padding:8px;font-weight:bold;border:1px solid #ddd;background:#f5f5f5">Service of Interest</td>
        <td style="padding:8px;border:1px solid #ddd">${serviceLabels[data.serviceOfInterest]}</td>
      </tr>
      <tr>
        <td style="padding:8px;font-weight:bold;border:1px solid #ddd;background:#f5f5f5">Message</td>
        <td style="padding:8px;border:1px solid #ddd;white-space:pre-wrap">${escapeHtml(data.message)}</td>
      </tr>
    </table>
    <p style="color:#666;font-size:12px;margin-top:16px">Sent via the Africom website contact form.</p>
  `;

  try {
    const { error } = await resend.emails.send({
      from: "Africom Website <onboarding@resend.dev>",
      to: [contactEmail],
      reply_to: data.email,
      subject,
      html,
    });

    if (error) {
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (err) {
    return {
      success: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
