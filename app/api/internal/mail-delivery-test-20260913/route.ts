import { timingSafeEqual } from "node:crypto";

import { NextResponse } from "next/server";

import { sendPlainDeliveryTest } from "@/lib/mail";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const TEST_TOKEN = "d9ef3ce724f74004a774c387c9651f76";
const RECIPIENTS = [
  "rahmiatillaavci@gmail.com",
  "rakofib@gmail.com",
  "ainqs.mail@gmail.com",
] as const;

function tokenMatches(value: string | null) {
  if (!value) return false;

  const supplied = Buffer.from(value);
  const expected = Buffer.from(TEST_TOKEN);
  return supplied.length === expected.length && timingSafeEqual(supplied, expected);
}

export async function POST(request: Request) {
  if (!tokenMatches(request.headers.get("x-mail-test-token"))) {
    return NextResponse.json({ ok: false }, { status: 404 });
  }

  const results = [];

  for (const recipient of RECIPIENTS) {
    results.push({ recipient, ...(await sendPlainDeliveryTest(recipient)) });
  }

  return NextResponse.json({ ok: true, results });
}
