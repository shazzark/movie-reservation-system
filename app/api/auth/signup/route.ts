// api/auth/signup/route.ts

// api/auth/signup/route.ts
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "../../../../lib/routeHandler";
import { signupUser } from "../../../../services/user.service";

export const POST = withDb(async (req: NextRequest, _context) => {
  console.log("SIGNUP ROUTE HIT!");
  const { name, email, password, confirmPassword } = await req.json();

  if (!name || !email || !password || !confirmPassword) {
    return NextResponse.json(
      { error: "All fields are required" },
      { status: 400 },
    );
  }

  if (password !== confirmPassword) {
    return NextResponse.json(
      { error: "Passwords do not match" },
      { status: 400 },
    );
  }

  const newUser = await signupUser({ name, email, password });

  return NextResponse.json(newUser, { status: 201 });
});
