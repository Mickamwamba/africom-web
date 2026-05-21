import { describe, it, expect, vi } from "vitest";
import { NextRequest } from "next/server";

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn(() => ({
    from: vi.fn(() => ({
      select: vi.fn().mockReturnThis(),
      eq: vi.fn().mockReturnThis(),
      in: vi.fn().mockReturnThis(),
      gte: vi.fn().mockReturnThis(),
      lt: vi.fn().mockReturnThis(),
      order: vi.fn().mockReturnThis(),
      range: vi.fn().mockResolvedValue({ data: [], error: null, count: 0 }),
    })),
  })),
}));

function makeReq(url: string) {
  return new NextRequest(url);
}

describe("GET /api/events", () => {
  it("returns 200 for a default request", async () => {
    const { GET } = await import("@/app/api/events/route");
    const res = await GET(makeReq("http://localhost/api/events"));
    expect(res.status).toBe(200);
    const body = await res.json();
    expect(body).toHaveProperty("data");
    expect(body).toHaveProperty("pagination");
  });

  it("accepts view=upcoming", async () => {
    const { GET } = await import("@/app/api/events/route");
    const res = await GET(makeReq("http://localhost/api/events?view=upcoming"));
    expect(res.status).toBe(200);
  });

  it("accepts view=past", async () => {
    const { GET } = await import("@/app/api/events/route");
    const res = await GET(makeReq("http://localhost/api/events?view=past"));
    expect(res.status).toBe(200);
  });

  it("rejects invalid view param with 400", async () => {
    const { GET } = await import("@/app/api/events/route");
    const res = await GET(makeReq("http://localhost/api/events?view=invalid"));
    expect(res.status).toBe(400);
  });

  it("accepts type=event", async () => {
    const { GET } = await import("@/app/api/events/route");
    const res = await GET(makeReq("http://localhost/api/events?type=event"));
    expect(res.status).toBe(200);
  });

  it("accepts type=training", async () => {
    const { GET } = await import("@/app/api/events/route");
    const res = await GET(makeReq("http://localhost/api/events?type=training"));
    expect(res.status).toBe(200);
  });

  it("returns paginated response with correct shape", async () => {
    const { GET } = await import("@/app/api/events/route");
    const res = await GET(makeReq("http://localhost/api/events?page=1&limit=5"));
    const body = await res.json();
    expect(body.pagination).toMatchObject({ page: 1, limit: 5 });
  });
});
