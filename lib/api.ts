import { NextResponse } from "next/server";
import { AuthError } from "@/lib/auth/session";
import { CsrfError } from "@/lib/auth/csrf";
import { ConflictError, FieldValidationError } from "@/lib/validation/primitives";

export function jsonError(error: unknown) {
  if (error instanceof AuthError) {
    return NextResponse.json({ error: error.message }, { status: 401 });
  }
  if (error instanceof CsrfError) {
    return NextResponse.json({ error: error.message }, { status: 403 });
  }
  if (error instanceof ConflictError) {
    return NextResponse.json({ error: error.message, code: "CONFLICT" }, { status: 409 });
  }
  if (error instanceof FieldValidationError) {
    return NextResponse.json(
      { error: error.message, fields: error.fields },
      { status: 400 },
    );
  }
  console.error("API error:", error instanceof Error ? error.message : "unknown");
  return NextResponse.json(
    { error: "Er is een fout opgetreden. Probeer het opnieuw." },
    { status: 500 },
  );
}
