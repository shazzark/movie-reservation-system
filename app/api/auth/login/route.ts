// api/auth/login/route.ts
// api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "../../../../lib/routeHandler";
import { loginUser } from "../../../../services/user.service";

export const POST = withDb(async (req: NextRequest, _context) => {
  const { email, password } = await req.json();

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password required" },
      { status: 400 },
    );
  }

  const user = await loginUser(email, password);
  return NextResponse.json(user);
});
