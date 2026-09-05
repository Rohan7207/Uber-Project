export function formatAddress(value) {
  if (!value) return "Address unavailable";

  const raw =
    typeof value === "string"
      ? value
      : value.displayName ||
        value.display_name ||
        value.formattedAddress ||
        value.address ||
        value.name ||
        "";

  if (!raw) return "Address unavailable";

  const cleaned = raw
    .replace(/\r?\n/g, ", ")
    .split(",")
    .map((part) => part.trim())
    .filter(Boolean)
    .filter((part, index, array) => array.indexOf(part) === index)
    .map((part) => {
      const normalized = part.replace(/\s+/g, " ");
      return normalized
        .split(" ")
        .map((word) =>
          word.length > 0
            ? word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
            : word,
        )
        .join(" ");
    })
    .join(", ");

  return cleaned || "Address unavailable";
}

export function formatPrice(value) {
  const numericValue = Number(value ?? 0);

  if (!Number.isFinite(numericValue)) {
    return "₹0";
  }

  return `₹${numericValue.toFixed(2)}`;
}
