import test from "node:test";
import assert from "node:assert/strict";
import { getAdminAccessState } from "../lib/admin-access.ts";
import {
  validateMovieRemoval,
  validateTheaterEdit,
  validateTheaterRemoval,
  validateShowtimeEdit,
  validateShowtimeRemoval,
} from "../lib/admin-cms-rules.ts";
import { toAdminUserResponse } from "../lib/admin-user-response.ts";
import { toPublicUserResponse } from "../lib/public-user-response.ts";
import { detectSafeImageMime } from "../lib/image-upload-validation.ts";
import { validateSeedDatabaseState } from "../lib/seed-rules.ts";

test("admin access distinguishes visitors, normal users, and admins", () => {
  assert.equal(getAdminAccessState(null), "unauthenticated");
  assert.equal(getAdminAccessState({ id: "user-id", role: "user" }), "forbidden");
  assert.equal(getAdminAccessState({ id: "admin-id", role: "admin" }), "allowed");
  assert.equal(getAdminAccessState({ role: "admin" }), "unauthenticated");
});

test("movie references prevent permanent deletion while unreferenced movies may be removed", () => {
  assert.doesNotThrow(() => validateMovieRemoval(false, false));
  assert.throws(() => validateMovieRemoval(true, false), /showtimes or reservations/);
  assert.throws(() => validateMovieRemoval(false, true), /showtimes or reservations/);
});

test("theater layout and references protect theater integrity", () => {
  assert.doesNotThrow(() => validateTheaterEdit(true, false));
  assert.doesNotThrow(() => validateTheaterEdit(false, true));
  assert.throws(() => validateTheaterEdit(true, true), /layout cannot change/);
  assert.doesNotThrow(() => validateTheaterRemoval(false, false));
  assert.throws(() => validateTheaterRemoval(true, false), /referenced/);
  assert.throws(() => validateTheaterRemoval(false, true), /referenced/);
});

test("showtime history and reservation references are retained", () => {
  const now = new Date("2030-01-01T00:00:00Z");
  assert.doesNotThrow(() => validateShowtimeEdit(new Date("2030-01-02T00:00:00Z"), undefined, 1, now));
  assert.throws(() => validateShowtimeEdit(new Date("2030-01-02T00:00:00Z"), new Date("2030-01-03T00:00:00Z"), 1, now), /reservations/);
  assert.throws(() => validateShowtimeRemoval(new Date("2030-01-02T00:00:00Z"), 1, now), /reservation records/);
});

test("admin user responses use an allowlist and never include authentication fields", () => {
  const response = toAdminUserResponse({
    _id: "user-id",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    createdAt: new Date("2030-01-01T00:00:00Z"),
    password: "hash-value",
    resetToken: "secret-value",
  }, 3);

  assert.deepEqual(Object.keys(response), ["id", "name", "email", "role", "createdAt", "bookingCount"]);
  assert.equal("password" in response, false);
  assert.equal("resetToken" in response, false);
});

test("public authentication responses never include password hashes or reset secrets", () => {
  const response = toPublicUserResponse({
    _id: "user-id",
    name: "Test User",
    email: "test@example.com",
    role: "user",
    createdAt: new Date("2030-01-01T00:00:00Z"),
    password: "hash-value",
    resetToken: "secret-value",
  });

  assert.deepEqual(Object.keys(response), ["id", "name", "email", "role", "createdAt"]);
  assert.equal("password" in response, false);
  assert.equal("resetToken" in response, false);
});

test("the development seed refuses to overwrite any existing catalog or booking data", () => {
  assert.doesNotThrow(() => validateSeedDatabaseState({ movies: 0, showtimes: 0, theaters: 0 }));
  for (const state of [
    { movies: 1, showtimes: 0, theaters: 0 },
    { movies: 0, showtimes: 1, theaters: 0 },
    { movies: 0, showtimes: 0, theaters: 1 },
    { hasBookings: true, movies: 0, showtimes: 0, theaters: 0 },
  ]) {
    assert.throws(() => validateSeedDatabaseState(state), /catalog is empty/);
  }
});

test("image upload checks file signatures and requires declared MIME to agree", () => {
  const png = Uint8Array.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  assert.equal(detectSafeImageMime(png, "image/png"), "image/png");
  assert.equal(detectSafeImageMime(png, "image/jpeg"), null);
  assert.equal(detectSafeImageMime(new TextEncoder().encode("<svg></svg>"), "image/svg+xml"), null);
});
