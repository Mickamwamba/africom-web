import { describe, it, expect } from "vitest";
import { validateInquiryForm } from "@/lib/formValidation";

describe("validateInquiryForm", () => {
  const valid = {
    name: "Jane Smith",
    email: "jane@example.com",
    serviceOfInterest: "export" as const,
    message: "I am interested in sourcing cashew nuts.",
  };

  it("returns no errors for a valid submission", () => {
    const errors = validateInquiryForm(valid);
    expect(Object.keys(errors)).toHaveLength(0);
  });

  it("requires name", () => {
    const errors = validateInquiryForm({ ...valid, name: "" });
    expect(errors.name).toBeDefined();
  });

  it("rejects name shorter than 2 characters", () => {
    const errors = validateInquiryForm({ ...valid, name: "J" });
    expect(errors.name).toBeDefined();
  });

  it("requires a valid email address", () => {
    const errors = validateInquiryForm({ ...valid, email: "not-an-email" });
    expect(errors.email).toBeDefined();
  });

  it("requires email", () => {
    const errors = validateInquiryForm({ ...valid, email: "" });
    expect(errors.email).toBeDefined();
  });

  it("requires message", () => {
    const errors = validateInquiryForm({ ...valid, message: "" });
    expect(errors.message).toBeDefined();
  });

  it("rejects message shorter than 10 characters", () => {
    const errors = validateInquiryForm({ ...valid, message: "Too short" });
    expect(errors.message).toBeDefined();
  });

  it("rejects message longer than 2000 characters", () => {
    const errors = validateInquiryForm({ ...valid, message: "x".repeat(2001) });
    expect(errors.message).toBeDefined();
  });

  it("allows optional organization to be omitted", () => {
    const { organization: _org, ...withoutOrg } = { ...valid, organization: undefined };
    const errors = validateInquiryForm(withoutOrg);
    expect(errors.organization).toBeUndefined();
  });

  it("accepts all valid serviceOfInterest values", () => {
    for (const service of ["export", "consultation", "other"] as const) {
      const errors = validateInquiryForm({ ...valid, serviceOfInterest: service });
      expect(errors.serviceOfInterest).toBeUndefined();
    }
  });
});
