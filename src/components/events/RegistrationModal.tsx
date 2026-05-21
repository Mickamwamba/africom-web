"use client";

import { useState } from "react";
import Modal from "@/components/ui/Modal";

interface RegistrationModalProps {
  eventId: string;
  eventTitle: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface FormState {
  full_name: string;
  email: string;
  phone: string;
  organisation: string;
  consent_given: boolean;
}

type FormErrors = Partial<Record<keyof FormState, string>>;

function validate(form: FormState): FormErrors {
  const errors: FormErrors = {};
  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!form.full_name.trim() || form.full_name.trim().length < 2)
    errors.full_name = "Full name is required (min 2 characters).";
  if (!form.email.trim() || !EMAIL_RE.test(form.email))
    errors.email = "Please enter a valid email address.";
  if (!form.phone.trim())
    errors.phone = "Phone number is required.";
  if (!form.consent_given)
    errors.consent_given = "You must agree to the privacy policy to register.";
  return errors;
}

export default function RegistrationModal({
  eventId, eventTitle, open, onOpenChange,
}: RegistrationModalProps) {
  const [form, setForm] = useState<FormState>({
    full_name: "", email: "", phone: "", organisation: "", consent_given: false,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string | null>(null);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
    setErrors((prev) => ({ ...prev, [name]: undefined }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    setServerError(null);

    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, event_id: eventId }),
      });
      const data = await res.json();

      if (res.ok && data.success) {
        setStatus("success");
        setTimeout(() => {
          onOpenChange(false);
          setStatus("idle");
          setForm({ full_name: "", email: "", phone: "", organisation: "", consent_given: false });
        }, 2500);
      } else {
        setStatus("error");
        setServerError(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setServerError("Unable to submit. Please check your connection and try again.");
    }
  }

  return (
    <Modal open={open} onOpenChange={onOpenChange} title={`Register for: ${eventTitle}`}>
      {status === "success" ? (
        <div className="py-8 text-center">
          <div className="text-4xl mb-3">✅</div>
          <p className="font-semibold text-gray-900">Registration confirmed!</p>
          <p className="text-sm text-gray-500 mt-1">We look forward to seeing you.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="space-y-4">
          {/* Full Name */}
          <Field label="Full Name" required error={errors.full_name}>
            <input
              name="full_name" type="text" autoComplete="name" required
              value={form.full_name} onChange={handleChange}
              className={inputClass(!!errors.full_name)}
              placeholder="Your full name"
            />
          </Field>

          {/* Email */}
          <Field label="Email Address" required error={errors.email}>
            <input
              name="email" type="email" autoComplete="email" required
              value={form.email} onChange={handleChange}
              className={inputClass(!!errors.email)}
              placeholder="you@example.com"
            />
          </Field>

          {/* Phone */}
          <Field label="Phone Number" required error={errors.phone}>
            <input
              name="phone" type="tel" autoComplete="tel" required
              value={form.phone} onChange={handleChange}
              className={inputClass(!!errors.phone)}
              placeholder="+254 700 000 000"
            />
          </Field>

          {/* Organisation */}
          <Field label="Organisation" error={undefined}>
            <input
              name="organisation" type="text" autoComplete="organization"
              value={form.organisation} onChange={handleChange}
              className={inputClass(false)}
              placeholder="Company or organisation (optional)"
            />
          </Field>

          {/* Consent */}
          <div>
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                name="consent_given" type="checkbox" checked={form.consent_given}
                onChange={handleChange}
                aria-label="I agree to the privacy policy"
                className="mt-0.5 h-4 w-4 rounded border-gray-300 text-brand-earth-brown focus:ring-brand-earth-brown"
              />
              <span className="text-sm text-gray-600">
                I agree to the{" "}
                <a href="/privacy" target="_blank" rel="noopener noreferrer" className="underline text-brand-earth-brown">
                  privacy policy
                </a>{" "}
                and consent to my data being used to process this registration.
              </span>
            </label>
            {errors.consent_given && (
              <p className="mt-1 text-xs text-red-600">{errors.consent_given}</p>
            )}
          </div>

          {serverError && (
            <div className="rounded-lg bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">
              {serverError}
            </div>
          )}

          <button
            type="submit"
            disabled={status === "submitting"}
            className="w-full rounded-lg bg-brand-earth-brown px-4 py-3 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-60 transition-opacity"
          >
            {status === "submitting" ? "Submitting…" : "Register Now"}
          </button>
        </form>
      )}
    </Modal>
  );
}

function inputClass(hasError: boolean) {
  return `w-full rounded-lg border px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown ${
    hasError ? "border-red-400 bg-red-50" : "border-gray-300"
  }`;
}

function Field({
  label, required, error, children,
}: {
  label: string; required?: boolean; error?: string; children: React.ReactNode;
}) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}
