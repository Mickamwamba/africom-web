import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

const VALID_VIEWS = ["upcoming", "past"] as const;
const VALID_TYPES = ["event", "training"] as const;
const DEFAULT_LIMIT = 12;
const MAX_LIMIT = 50;

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;

  const view = (searchParams.get("view") ?? "upcoming") as string;
  const type = searchParams.get("type");
  const category = searchParams.get("category");
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    MAX_LIMIT,
    Math.max(1, parseInt(searchParams.get("limit") ?? String(DEFAULT_LIMIT), 10))
  );

  if (!VALID_VIEWS.includes(view as (typeof VALID_VIEWS)[number])) {
    return NextResponse.json(
      { error: `Invalid query parameter: view. Must be one of: ${VALID_VIEWS.join(", ")}` },
      { status: 400 }
    );
  }

  if (type && !VALID_TYPES.includes(type as (typeof VALID_TYPES)[number])) {
    return NextResponse.json(
      { error: `Invalid query parameter: type. Must be one of: ${VALID_TYPES.join(", ")}` },
      { status: 400 }
    );
  }

  try {
    const supabase = await createClient();
    const now = new Date().toISOString();

    let query = supabase
      .from("events")
      .select("*, category:categories(id, name)", { count: "exact" })
      .eq("status", "published");

    if (view === "upcoming") {
      query = query.gte("end_at", now).order("start_at", { ascending: true });
    } else {
      query = query.lt("end_at", now).order("start_at", { ascending: false });
    }

    if (type) query = query.eq("type", type);
    if (category) query = query.eq("category_id", category);

    const from = (page - 1) * limit;
    const to = from + limit - 1;
    query = query.range(from, to);

    const { data, error, count } = await query;

    if (error) {
      console.error("[GET /api/events]", error);
      return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }

    const total = count ?? 0;
    return NextResponse.json({
      data: data ?? [],
      pagination: {
        page,
        limit,
        total,
        total_pages: Math.ceil(total / limit),
      },
    });
  } catch (err) {
    console.error("[GET /api/events]", err);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
