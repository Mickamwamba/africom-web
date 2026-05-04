export interface InquiryFormInput {
  name: string;
  organization?: string;
  email: string;
  serviceOfInterest: "export" | "consultation" | "other";
  message: string;
}

export type FormErrors = Partial<Record<keyof InquiryFormInput, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const VALID_SERVICES = ["export", "consultation", "other"] as const;

export function validateInquiryForm(data: Partial<InquiryFormInput>): FormErrors {
  const errors: FormErrors = {};

  const name = (data.name ?? "").trim();
  if (!name) {
    errors.name = "Name is required.";
  } else if (name.length < 2) {
    errors.name = "Name must be at least 2 characters.";
  } else if (name.length > 100) {
    errors.name = "Name must be 100 characters or fewer.";
  }

  const email = (data.email ?? "").trim();
  if (!email) {
    errors.email = "Email address is required.";
  } else if (!EMAIL_RE.test(email)) {
    errors.email = "Please enter a valid email address.";
  }

  if (data.organization !== undefined && data.organization !== "") {
    if (data.organization.length > 200) {
      errors.organization = "Organisation name must be 200 characters or fewer.";
    }
  }

  if (!data.serviceOfInterest || !(VALID_SERVICES as readonly string[]).includes(data.serviceOfInterest)) {
    errors.serviceOfInterest = "Please select a service of interest.";
  }

  const message = (data.message ?? "").trim();
  if (!message) {
    errors.message = "Message is required.";
  } else if (message.length < 10) {
    errors.message = "Message must be at least 10 characters.";
  } else if (message.length > 2000) {
    errors.message = "Message must be 2000 characters or fewer.";
  }

  return errors;
}
