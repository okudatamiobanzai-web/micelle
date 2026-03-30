import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
  { auth: { autoRefreshToken: false, persistSession: false } }
);

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: "userId required" }, { status: 400 });
    }

    const { data: adminData, error } = await supabaseAdmin
      .from("admin_users")
      .select("*")
      .eq("user_id", userId)
      .single();

    if (error || !adminData) {
      return NextResponse.json({ admin: null }, { status: 403 });
    }

    return NextResponse.json({ admin: adminData });
  } catch (e) {
    console.error("Admin auth check error:", e);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
