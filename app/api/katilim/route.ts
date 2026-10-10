// Legacy intake is closed. Existing MembershipApplication records remain read-only.
export async function POST() {
  return Response.json({ code: "LEGACY_CLOSED", error: "Bu form kapandı. Yeni üyelik formunu kullanın." }, { status: 410, headers: { "Cache-Control": "no-store" } });
}
