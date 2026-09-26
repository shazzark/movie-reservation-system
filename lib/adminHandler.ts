// lib/adminHandler.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";
import { getAdminAccessState } from "./admin-access";

/**
 * Wrap a route handler and ensure the user is an admin
 */
export const withAdmin = (
  handler: (req: NextRequest, context: { params: Promise<Record<string, string>> }) => Promise<NextResponse>,
) => {
  return async (req: NextRequest, context: { params: Promise<Record<string, string>> }) => {
    const session = await getServerSession(authOptions);

    const access = getAdminAccessState(session?.user);
    if (access === "unauthenticated") {
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }
    if (access === "forbidden") {
      return NextResponse.json(
        { error: "Administrator access required." },
        { status: 403 },
      );
    }

    return handler(req, context);
  };
};
