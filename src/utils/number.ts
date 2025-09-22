const sanitizeNumericInput = (value: unknown): string => {
  const raw = String(value ?? '')
    .trim()
    .replace(/\s+/g, '')
    .replace(/[^0-9,.+-]/g, '');

  if (!raw) return '';

  const hasLeadingMinus = raw.startsWith('-');
  const sanitized = raw.replace(/[+-]/g, '');

  if (!sanitized) return hasLeadingMinus ? '-' : '';

  return hasLeadingMinus ? `-${sanitized}` : sanitized;
};

const hasThousandSeparators = (value: string): boolean => {
  const unsigned = value.replace(/^[+-]/, '');
  const separators = unsigned.match(/[.,]/g);

  if (!separators) return false;

  const uniqueSeparators = new Set(separators);

  if (uniqueSeparators.size > 1) {
    return true;
  }

  const separator = separators[0];
  const parts = unsigned.split(separator);

  if (parts.length <= 1) return false;

  if (parts.length === 2) {
    const [integerPart, fractionalPart] = parts;
    const integerDigits = integerPart.replace(/\D/g, '');

    if (!integerDigits || Number(integerDigits) === 0) {
      return false;
    }

    return fractionalPart.length === 3;
  }

  return parts.slice(1).every((group) => group.length === 3);
};

type DecimalSeparator = '.' | ',' | null;

const determineDecimalSeparator = (
  value: string,
  thousandSeparated: boolean,
): DecimalSeparator => {
  const unsigned = value.replace(/^[+-]/, '');
  const lastDot = unsigned.lastIndexOf('.');
  const lastComma = unsigned.lastIndexOf(',');

  if (lastDot === -1 && lastComma === -1) {
    return null;
  }

  if (lastDot !== -1 && lastComma !== -1) {
    return lastDot > lastComma ? '.' : ',';
  }

  if (!thousandSeparated) {
    return lastDot !== -1 ? '.' : ',';
  }

  return null;
};

const determineThousandSeparator = (
  value: string,
  decimalSeparator: DecimalSeparator,
  thousandSeparated: boolean,
): '.' | ',' | null => {
  if (!thousandSeparated) return null;

  const unsigned = value.replace(/^[+-]/, '');
  const separators = unsigned.match(/[.,]/g) as Array<'.' | ','> | null;

  if (!separators || separators.length === 0) return null;

  const uniqueSeparators = Array.from(new Set(separators)) as Array<'.' | ','>;

  if (decimalSeparator) {
    return uniqueSeparators.find((separator) => separator !== decimalSeparator) ?? null;
  }

  return uniqueSeparators[0] ?? null;
};

export const normaliseNumericString = (value: unknown): string => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value.toString() : '0';
  }

  const sanitized = sanitizeNumericInput(value);

  if (!sanitized || sanitized === '-') {
    return '0';
  }

  const thousandSeparated = hasThousandSeparators(sanitized);
  const decimalSeparator = determineDecimalSeparator(sanitized, thousandSeparated);
  const thousandSeparator = determineThousandSeparator(
    sanitized,
    decimalSeparator,
    thousandSeparated,
  );

  let normalized = sanitized;

  if (thousandSeparator) {
    const thousandRegex = new RegExp(`\\${thousandSeparator}`, 'g');
    normalized = normalized.replace(thousandRegex, '');
  }

  if (decimalSeparator && decimalSeparator !== '.') {
    const decimalRegex = new RegExp(`\\${decimalSeparator}`, 'g');
    normalized = normalized.replace(decimalRegex, '.');
  }

  return normalized;
};

export const parseCurrencyToNumber = (value: unknown): number => {
  if (typeof value === 'number') {
    return Number.isFinite(value) ? value : 0;
  }

  if (value == null) return 0;

  const normalized = normaliseNumericString(value);
  const parsed = Number.parseFloat(normalized);

  return Number.isNaN(parsed) ? 0 : parsed;
};
