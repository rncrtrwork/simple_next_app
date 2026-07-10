import { describe, expect, it } from 'vitest';
import { formatSignedCurrency, formatSignedPercent, formatWholeCurrency } from './formatters';

describe('ledger formatters', () => {
  it('formats whole currency without cents', () => {
    expect(formatWholeCurrency(18_756_321)).toBe('$18,756,321');
  });

  it('formats signed percentages with explicit positive sign', () => {
    expect(formatSignedPercent(0.74)).toBe('+0.74%');
    expect(formatSignedPercent(-0.35)).toBe('-0.35%');
  });

  it('keeps negative accounting values aligned with the terminal display', () => {
    expect(formatSignedCurrency(-1223.5)).toBe('$-1,223.50');
  });
});
