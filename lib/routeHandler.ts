// lib/routeHandler.ts
import { NextRequest, NextResponse } from "next/server";
import { handleDbConnection } from "./dbHandler";

/**
 * Wrap a route handler with DB connection support.
 * Supports both static and dynamic routes.
 */
// lib/routeHandler.ts

/**
 * Wrap a route handler with DB connection support.
 * Supports both static and dynamic routes.
 */
export const withDb = (
  handler: (
    req: NextRequest,
    // 1. Update type here: params is now a Promise
    context: { params: Promise<Record<string, string>> },
  ) => Promise<NextResponse>,
) => {
  return async (
    req: NextRequest,
    // 2. Update type here: params is now a Promise
    context: { params: Promise<Record<string, string>> },
  ) => {
    try {
      await handleDbConnection();
      return await handler(req, context);
    } catch (error) {
      return NextResponse.json(
        { error: (error as Error).message },
        { status: 500 },
      );
    }
  };
};
