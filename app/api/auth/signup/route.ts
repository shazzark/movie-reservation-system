// api/auth/signup/route.ts

// api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "../../../../lib/routeHandler";
import { signupUser } from "../../../../services/user.service";
import { toPublicUserResponse } from "../../../../lib/public-user-response";
import { z } from "zod";

const signupSchema = z.object({
  name: z.string().trim().min(1).max(120),
  email: z.string().trim().email().max(254),
  password: z.string().min(8).max(72),
  confirmPassword: z.string().min(8).max(72),
}).strict().refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export const POST = withDb(async (req: NextRequest) => {
  const parsed = signupSchema.safeParse(await req.json().catch(() => null));
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues.map((issue) => issue.message).join(" ") },
      { status: 400 },
    );
  }
  const newUser = await signupUser(parsed.data);
  return NextResponse.json(toPublicUserResponse(newUser), { status: 201 });
});
