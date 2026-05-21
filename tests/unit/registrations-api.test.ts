import { describe, it, expect, vi } from "vitest";
import type { NextRequest } from "next/server";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn((table: string) => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      single: vi.fn().mockResolvedValue(
        table === "events"
          ? { data: { id: "evt-123", status: "published" }, error: null }
          : { data: null, error: null }
      ),
      insert: vi.fn().mockResolvedValue({ data: [{ id: "reg-1" }], error: null }),
    })),
  })),
}));

function makeReq(body: object) {
  return new Request("http://localhost/api/registrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  }) as unknown as NextRequest;
}

const validBody = {
  event_id: "evt-123",
  full_name: "Jane Doe",
  email: "jane@example.com",
  phone: "+254700000000",
  consent_given: true,
};

describe("POST /api/registrations", () => {
  it("returns 201 for a valid payload", async () => {
    const { POST } = await import("@/app/api/registrations/route");
    const res = await POST(makeReq(validBody));
    expect(res.status).toBe(201);
    expect((await res.json()).success).toBe(true);
  });

  it("returns 400 when full_name is missing", async () => {
    const { POST } = await import("@/app/api/registrations/route");
    const res = await POST(makeReq({ ...validBody, full_name: "" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors).toHaveProperty("full_name");
  });

  it("returns 400 when email is invalid", async () => {
    const { POST } = await import("@/app/api/registrations/route");
    const res = await POST(makeReq({ ...validBody, email: "not-an-email" }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors).toHaveProperty("email");
  });

  it("returns 400 when consent_given is false", async () => {
    const { POST } = await import("@/app/api/registrations/route");
    const res = await POST(makeReq({ ...validBody, consent_given: false }));
    expect(res.status).toBe(400);
    expect((await res.json()).errors).toHaveProperty("consent_given");
  });

  it("returns 400 when phone is missing", async () => {
    const { POST } = await import("@/app/api/registrations/route");
    const res = await POST(makeReq({ ...validBody, phone: "" }));
    expect(res.status).toBe(400);
  });
});
