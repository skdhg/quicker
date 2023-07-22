import mongoose from "mongoose";

export function getType(t: unknown) {
  if (Buffer.isBuffer(t)) return "buffer";
  if (t instanceof Date) return "date";
  if (Array.isArray(t)) return "array";
  if (t === null) return "null";
  return typeof t;
}
