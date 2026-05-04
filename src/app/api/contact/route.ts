import { NextRequest, NextResponse } from "next/server";
import { validateInquiryForm } from "@/lib/formValidation";
import { sendInquiryEmail } from "@/lib/email";

export async function POST(req: NextRequest) {
  const contentType = req.headers.get("content-type") ?? "";
  if (!contentType.includes("application/json")) {
    return NextResponse.json(
      { success: false, message: "Content-Type must be application/json" },
      { status: 400 }
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json(
      { success: false, message: "Invalid JSON body" },
      { status: 400 }
    );
  }

  if (typeof body !== "object" || body === null) {
    return NextResponse.json(
      { success: false, message: "Request body must be a JSON object" },
      { status: 400 }
    );
  }

  const data = body as Record<string, unknown>;
  const errors = validateInquiryForm({
    name: typeof data.name === "string" ? data.name : "",
    email: typeof data.email === "string" ? data.email : "",
    organization: typeof data.organization === "string" ? data.organization : undefined,
    serviceOfInterest: (["export", "consultation", "other"] as const).includes(
      data.serviceOfInterest as "export" | "consultation" | "other"
    )
      ? (data.serviceOfInterest as "export" | "consultation" | "other")
      : ("" as never),
    message: typeof data.message === "string" ? data.message : "",
  });

  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  const result = await sendInquiryEmail({
    name: (data.name as string).trim(),
    email: (data.email as string).trim(),
    organization:
      typeof data.organization === "string" && data.organization.trim()
        ? data.organization.trim()
        : undefined,
    serviceOfInterest: data.serviceOfInterest as "export" | "consultation" | "other",
    message: (data.message as string).trim(),
  });

  if (!result.success) {
    const contactEmail = process.env.CONTACT_EMAIL ?? "info@africom-exports.com";
    return NextResponse.json(
      {
        success: false,
        message: `Unable to send your inquiry at this time. Please email us directly at ${contactEmail}.`,
      },
      { status: 500 }
    );
  }

  return NextResponse.json({
    success: true,
    message: "Your inquiry has been received. We will be in touch within 2 business days.",
  });
}
