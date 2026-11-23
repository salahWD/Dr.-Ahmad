const countryCode = () =>
  (process.env.DEFAULT_COUNTRY_CODE ?? "961").replace(/\D/g, "") || "961";

/** Keeps a leading "+" and digits; returns null when the number is implausible. */
export function normalizePhone(input: string) {
  const trimmed = input.trim();
  const digits = trimmed.replace(/\D/g, "");
  if (digits.length < 7 || digits.length > 15) return null;
  return trimmed.startsWith("+") ? `+${digits}` : digits;
}

/** Digits for a wa.me link. Local numbers (8 digits or fewer) get the clinic's country code. */
export function whatsappDigits(phone: string) {
  const digits = phone.replace(/\D/g, "");
  if (phone.startsWith("+")) return digits;
  if (digits.startsWith("00")) return digits.slice(2);
  if (digits.length <= 8) return countryCode() + digits.replace(/^0/, "");
  return digits;
}
