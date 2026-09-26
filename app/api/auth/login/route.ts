// api/auth/login/route.ts
// api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "../../../../lib/routeHandler";
import { loginUser } from "../../../../services/user.service";
import { toPublicUserResponse } from "../../../../lib/public-user-response";
import { z } from "zod";

const loginSchema = z.object({
  email: z.string().trim().email().max(254),
  password: z.string().min(1).max(72),
}).strict();

export const POST = withDb(async (req: NextRequest) => {
  const parsed = loginSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json({ error: "A valid email and password are required." }, { status: 400 });
  }
  const user = await loginUser(parsed.data.email, parsed.data.password);
  return NextResponse.json(toPublicUserResponse(user));
});
