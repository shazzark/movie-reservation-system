// api/auth/forgot/route.ts

// api/auth/forgot/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "../../../../lib/routeHandler";
import { forgotPassword } from "../../../../services/user.service";

export const POST = withDb(async (req: NextRequest, _context) => {
  const { email } = await req.json();

  if (!email) {
    return NextResponse.json({ error: "Email required" }, { status: 400 });
  }

  const result = await forgotPassword(email);
  return NextResponse.json(result);
});
