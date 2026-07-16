import { customAlphabet } from "nanoid";

// URL-safe alphabet, no lookalike-prone punctuation. 28 chars ≈ 166 bits of
// entropy — unguessable, never sequential, never derived from business data.
const nanoid = customAlphabet(
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ",
  28,
);

/** Generate a fresh, revocable per-screen display token. */
export function newDisplayToken(): string {
  return nanoid();
}
