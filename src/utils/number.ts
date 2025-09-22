export const parseCurrencyToNumber = (value: unknown): number => {
  if (typeof value === 'number') return value;
  if (value == null) return 0;

  const sanitized = String(value)
    .trim()
    .replace(/\s/g, '')
    .replace(/[^\d,.-]/g, '');

  if (!sanitized) return 0;

  const normalized = sanitized.replace(/\./g, '').replace(/,/g, '.');
  const parsed = parseFloat(normalized);

  return Number.isNaN(parsed) ? 0 : parsed;
};
