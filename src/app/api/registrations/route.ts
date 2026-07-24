import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

interface RegistrationBody {
  event_id?: unknown;
  full_name?: unknown;
  email?: unknown;
  phone?: unknown;
  organisation?: unknown;
  consent_given?: unknown;
}

function validate(body: RegistrationBody): Record<string, string> {
  const errors: Record<string, string> = {};

  if (!body.event_id || typeof body.event_id !== "string") {
    errors.event_id = "event_id is required.";
  }

  const name = typeof body.full_name === "string" ? body.full_name.trim() : "";
  if (!name || name.length < 2) errors.full_name = "Full name is required (min 2 characters).";
  else if (name.length > 100) errors.full_name = "Full name must be 100 characters or fewer.";

  const email = typeof body.email === "string" ? body.email.trim() : "";
  if (!email) errors.email = "Email address is required.";
  else if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";

  const phone = typeof body.phone === "string" ? body.phone.trim() : "";
  if (!phone) errors.phone = "Phone number is required.";
  else if (phone.length > 30) errors.phone = "Phone number must be 30 characters or fewer.";

  if (typeof body.organisation === "string" && body.organisation.length > 200) {
    errors.organisation = "Organisation must be 200 characters or fewer.";
  }

  if (body.consent_given !== true) {
    errors.consent_given = "You must agree to the privacy policy to register.";
  }

  return errors;
}

export async function POST(req: NextRequest) {
  let body: RegistrationBody;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ success: false, errors: { _: "Invalid JSON" } }, { status: 400 });
  }

  const errors = validate(body);
  if (Object.keys(errors).length > 0) {
    return NextResponse.json({ success: false, errors }, { status: 400 });
  }

  try {
    const supabase = await createClient();

    // Verify the event exists and is published
    const { data: event, error: eventError } = await supabase
      .from("events")
      .select("id, status")
      .eq("id", body.event_id as string)
      .eq("status", "published")
      .single();

    if (eventError || !event) {
      return NextResponse.json(
        { success: false, error: "Event not found or no longer available" },
        { status: 404 }
      );
    }

    const { error: insertError } = await supabase.from("registrations").insert({
      event_id: body.event_id as string,
      full_name: (body.full_name as string).trim(),
      email: (body.email as string).trim(),
      phone: (body.phone as string).trim(),
      organisation: typeof body.organisation === "string" && body.organisation.trim()
        ? body.organisation.trim()
        : null,
      consent_given: true,
      status: "pending",
    });

    if (insertError) {
      console.error("[POST /api/registrations]", insertError);
      return NextResponse.json(
        { success: false, error: "Unable to process your registration. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { success: true, message: "You have been registered successfully. We look forward to seeing you!" },
      { status: 201 }
    );
  } catch (err) {
    console.error("[POST /api/registrations]", err);
    return NextResponse.json(
      { success: false, error: "Unable to process your registration. Please try again." },
      { status: 500 }
    );
  }
}
