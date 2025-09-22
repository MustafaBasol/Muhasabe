import { normaliseNumericString, parseCurrencyToNumber } from './number.js';

const strictEqual = (actual: unknown, expected: unknown, message?: string) => {
  if (actual !== expected) {
    throw new Error(message ?? `Expected ${String(actual)} to strictly equal ${String(expected)}`);
  }
};

const approximatelyEqual = (actual: number, expected: number, epsilon = 1e-9) => {
  if (Number.isNaN(actual) || Math.abs(actual - expected) > epsilon) {
    throw new Error(`Expected ${actual} to be within ${epsilon} of ${expected}`);
  }
};

const normalisationCases: Array<{ input: string; expected: string }> = [
  { input: '0.123', expected: '0.123' },
  { input: '0,123', expected: '0.123' },
  { input: '-0,123', expected: '-0.123' },
  { input: '1.234', expected: '1234' },
  { input: '12,345', expected: '12345' },
];

normalisationCases.forEach(({ input, expected }) => {
  const actual = normaliseNumericString(input);
  strictEqual(actual, expected, `normaliseNumericString(${input}) should be ${expected}`);
});

const parsingCases: Array<{ input: string; expected: number }> = [
  { input: '0.123', expected: 0.123 },
  { input: '0,123', expected: 0.123 },
  { input: '-0,123', expected: -0.123 },
  { input: '1.234', expected: 1234 },
  { input: '12,345', expected: 12345 },
];

parsingCases.forEach(({ input, expected }) => {
  const actual = parseCurrencyToNumber(input);
  approximatelyEqual(actual, expected);
});

console.log('All number utility tests passed.');
