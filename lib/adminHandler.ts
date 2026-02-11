// lib/adminHandler.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth";

/**
 * Wrap a route handler and ensure the user is an admin
 */
export const withAdmin = (
  handler: (req: NextRequest) => Promise<NextResponse>,
) => {
  return async (req: NextRequest) => {
    const session = await getServerSession(authOptions);

    if (!session?.user || session.user.role !== "admin") {
      return NextResponse.json(
        { error: "Forbidden. Admins only." },
        { status: 403 },
      );
    }

    return handler(req);
  };
};
