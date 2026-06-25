export function parseNumber(value: unknown): number | null {
  if (value == null || value === "") return null;
  const num = typeof value === "number" ? value : parseFloat(String(value));
  return Number.isFinite(num) ? num : null;
}

export function formatAddress(parts: {
  address?: string;
  city?: string;
  state?: string;
  zip?: string;
}): string {
  const line1 = parts.address?.trim() ?? "";
  const cityStateZip = [parts.city, parts.state, parts.zip]
    .filter(Boolean)
    .join(", ")
    .replace(/,\s*,/g, ",")
    .trim();

  if (line1 && cityStateZip) {
    return `${line1}, ${cityStateZip}`;
  }
  return line1 || cityStateZip || "N/A";
}

export function normalizeCcn(ccn: string): string {
  return ccn.replace(/\D/g, "").padStart(6, "0").slice(-6);
}

export function isValidCcn(ccn: string): boolean {
  return /^\d{6}$/.test(normalizeCcn(ccn));
}

export function medicareCareCompareUrl(ccn: string): string {
  return `https://www.medicare.gov/care-compare/details/nursing-home/${normalizeCcn(ccn)}`;
}

export function toDisplayName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b([a-z])/g, (_, letter: string) => letter.toUpperCase());
}
