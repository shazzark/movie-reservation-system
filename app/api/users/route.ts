// api/users/routes.ts
import { NextRequest, NextResponse } from "next/server";
import { withDb } from "../../../lib/routeHandler";
import { withAdmin } from "../../../lib/adminHandler";

import {
  getAllUsers,
  getUserById,
  createUser,
  updateUserRole,
  deleteUser,
} from "../../../services/user.service";

// GET /api/users → admin only
export const GET = withDb(
  withAdmin(async (req: NextRequest) => {
    const users = await getAllUsers();
    return NextResponse.json(users);
  }),
);

// POST /api/users → admin only
export const POST = withDb(
  withAdmin(async (req: NextRequest) => {
    const data = await req.json();
    const newUser = await createUser(data);
    return NextResponse.json(newUser, { status: 201 });
  }),
);

// PATCH /api/users/:id → admin only
export const PATCH = withDb(
  withAdmin(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { role } = await req.json();

    if (!id || !role)
      return NextResponse.json(
        { error: "Missing id or role" },
        { status: 400 },
      );

    const updatedUser = await updateUserRole(id, role);
    return NextResponse.json(updatedUser);
  }),
);

// DELETE /api/users/:id → admin only
export const DELETE = withDb(
  withAdmin(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

    const deletedUser = await deleteUser(id);
    return NextResponse.json(deletedUser);
  }),
);

// GET /api/users/:id → admin only
export const GET_BY_ID = withDb(
  withAdmin(async (req: NextRequest) => {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }

    const user = await getUserById(id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user);
  }),
);
