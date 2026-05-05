"use client";

import { useState } from "react";
import Button from "./Button";
import { validateInquiryForm, type InquiryFormInput, type FormErrors } from "@/lib/formValidation";

const SERVICE_OPTIONS = [
  { value: "export", label: "Export Products" },
  { value: "consultation", label: "Consultation Services" },
  { value: "other", label: "General Inquiry" },
] as const;

interface Props {
  defaultService?: InquiryFormInput["serviceOfInterest"];
}

export default function InquiryForm({ defaultService }: Props) {
  const [form, setForm] = useState<Partial<InquiryFormInput>>({
    serviceOfInterest: defaultService,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    if (errors[name as keyof FormErrors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }));
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationErrors = validateInquiryForm(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setStatus("submitting");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setStatus("success");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  }

  if (status === "success") {
    return (
      <div data-testid="form-success" className="text-center py-12">
        <div className="text-5xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Received</h2>
        <p className="text-gray-600 max-w-md mx-auto">
          Thank you for reaching out. We will be in touch within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      {/* Name */}
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
          Full Name <span className="text-red-500">*</span>
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autoComplete="name"
          value={form.name ?? ""}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown ${
            errors.name ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Your full name"
        />
        {errors.name && (
          <p data-testid="error-name" className="mt-1 text-xs text-red-600">
            {errors.name}
          </p>
        )}
      </div>

      {/* Organisation */}
      <div>
        <label htmlFor="organization" className="block text-sm font-medium text-gray-700 mb-1">
          Organisation <span className="text-gray-400 text-xs">(optional)</span>
        </label>
        <input
          id="organization"
          name="organization"
          type="text"
          autoComplete="organization"
          value={form.organization ?? ""}
          onChange={handleChange}
          className="w-full rounded-lg border border-gray-300 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown"
          placeholder="Company or organisation name"
        />
      </div>

      {/* Email */}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
          Email Address <span className="text-red-500">*</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autoComplete="email"
          value={form.email ?? ""}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown ${
            errors.email ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
          placeholder="you@example.com"
        />
        {errors.email && (
          <p data-testid="error-email" className="mt-1 text-xs text-red-600">
            {errors.email}
          </p>
        )}
      </div>

      {/* Service of interest */}
      <div>
        <label htmlFor="serviceOfInterest" className="block text-sm font-medium text-gray-700 mb-1">
          Service of Interest <span className="text-red-500">*</span>
        </label>
        <select
          id="serviceOfInterest"
          name="serviceOfInterest"
          value={form.serviceOfInterest ?? ""}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown ${
            errors.serviceOfInterest ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
        >
          <option value="" disabled>Select a service…</option>
          {SERVICE_OPTIONS.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
        {errors.serviceOfInterest && (
          <p className="mt-1 text-xs text-red-600">{errors.serviceOfInterest}</p>
        )}
      </div>

      {/* Message */}
      <div>
        <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          id="message"
          name="message"
          rows={5}
          value={form.message ?? ""}
          onChange={handleChange}
          className={`w-full rounded-lg border px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-earth-brown resize-vertical ${
            errors.message ? "border-red-400 bg-red-50" : "border-gray-300"
          }`}
          placeholder="Tell us about your requirements…"
        />
        {errors.message && (
          <p data-testid="error-message" className="mt-1 text-xs text-red-600">
            {errors.message}
          </p>
        )}
      </div>

      {status === "error" && (
        <div className="rounded-lg bg-red-50 border border-red-200 p-4 text-sm text-red-700">
          Unable to send your message at this time. Please email us directly at{" "}
          <a href="mailto:info@africom.biz" className="underline">
            info@africom.biz
          </a>
          .
        </div>
      )}

      <Button
        type="submit"
        variant="primary"
        size="lg"
        disabled={status === "submitting"}
        className="w-full"
      >
        {status === "submitting" ? "Sending…" : "Send Inquiry"}
      </Button>
    </form>
  );
}
