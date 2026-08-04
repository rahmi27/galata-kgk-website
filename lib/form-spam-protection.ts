export const FORM_HONEYPOT_FIELD = "website";

export function isHoneypotTriggered(payload: unknown) {
  if (
    typeof payload !== "object" ||
    payload === null ||
    Array.isArray(payload)
  ) {
    return false;
  }

  const value = (payload as Record<string, unknown>)[FORM_HONEYPOT_FIELD];
  return typeof value === "string" && value.trim().length > 0;
}
