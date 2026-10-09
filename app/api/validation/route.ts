import { NextRequest, NextResponse } from "next/server";
import { assertSameOrigin } from "@/lib/auth/csrf";
import { jsonError } from "@/lib/api";
import {
  getProductValidation,
  saveProductValidation,
} from "@/lib/services/validation-product";

export async function GET() {
  try {
    const validation = await getProductValidation();
    return NextResponse.json({ validation });
  } catch (e) {
    return jsonError(e);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await assertSameOrigin();
    const body = await request.json();
    const validation = await saveProductValidation(body);
    return NextResponse.json({ validation });
  } catch (e) {
    return jsonError(e);
  }
}
