import { describe, expect, it } from 'vitest';
import { terminalRows, viewFilters } from './mockTerminal';

describe('terminal view filters', () => {
  it('keeps positions as the complete ledger view', () => {
    expect(terminalRows.filter(viewFilters.positions)).toHaveLength(terminalRows.length);
  });

  it('limits risk exposure to non-low-risk rows', () => {
    const riskRows = terminalRows.filter(viewFilters.risk);

    expect(riskRows.length).toBeGreaterThan(0);
    expect(riskRows.every((row) => row.risk !== 'LOW')).toBe(true);
  });

  it('limits audit trail to reviewable rows', () => {
    const auditRows = terminalRows.filter(viewFilters.audit);

    expect(auditRows.length).toBeGreaterThan(0);
    expect(auditRows.every((row) => row.status !== 'ACTIVE' || row.risk === 'HIGH')).toBe(true);
  });
});
