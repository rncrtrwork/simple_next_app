export type FolderKey = "live" | "mandates" | "credit" | "audit" | "settled";

export type StreamState = "connecting" | "live" | "replaying" | "offline";

export type DealRecord = {
  id: string;
  folder: FolderKey;
  issuer: string;
  ticker: string;
  desk: string;
  tranche: string;
  currency: "USD" | "EUR" | "GBP";
  notional: number;
  coupon: number;
  spread: number;
  yield: number;
  bid: number;
  ask: number;
  last: number;
  dv01: number;
  risk: "LOW" | "MED" | "HIGH";
  auditState: "PASS" | "WATCH" | "BREACH";
  updatedAt: string;
};

export type DealPatch = Partial<DealRecord> & Pick<DealRecord, "id">;

export const folders: Array<{
  key: FolderKey;
  label: string;
  ledgerCode: string;
}> = [
  { key: "live", label: "Live Ledger", ledgerCode: "LIV" },
  { key: "mandates", label: "Mandates", ledgerCode: "MND" },
  { key: "credit", label: "Credit Watch", ledgerCode: "CRD" },
  { key: "audit", label: "Audit Queue", ledgerCode: "AUD" },
  { key: "settled", label: "Settled", ledgerCode: "STL" },
];

export const seedDeals: DealRecord[] = [
  {
    id: "DL-10482",
    folder: "live",
    issuer: "Atlas Rail HoldCo",
    ticker: "ATLR",
    desk: "IG",
    tranche: "10Y SEN",
    currency: "USD",
    notional: 820000000,
    coupon: 5.625,
    spread: 128,
    yield: 5.74,
    bid: 99.42,
    ask: 99.58,
    last: 99.51,
    dv01: 612000,
    risk: "LOW",
    auditState: "PASS",
    updatedAt: "2026-07-09T21:28:00.000Z",
  },
  {
    id: "DL-10496",
    folder: "live",
    issuer: "Meridian Data Trust",
    ticker: "MDTN",
    desk: "TMT",
    tranche: "7Y SEC",
    currency: "USD",
    notional: 540000000,
    coupon: 6.125,
    spread: 184,
    yield: 6.22,
    bid: 100.11,
    ask: 100.24,
    last: 100.18,
    dv01: 344000,
    risk: "MED",
    auditState: "WATCH",
    updatedAt: "2026-07-09T21:29:30.000Z",
  },
  {
    id: "DL-10510",
    folder: "mandates",
    issuer: "Crownline Utilities",
    ticker: "CRWU",
    desk: "UTIL",
    tranche: "30Y MTN",
    currency: "USD",
    notional: 1250000000,
    coupon: 5.95,
    spread: 151,
    yield: 6.04,
    bid: 98.88,
    ask: 99.03,
    last: 98.96,
    dv01: 1645000,
    risk: "LOW",
    auditState: "PASS",
    updatedAt: "2026-07-09T21:25:40.000Z",
  },
  {
    id: "DL-10534",
    folder: "credit",
    issuer: "Northstar Aviation",
    ticker: "NSTA",
    desk: "HY",
    tranche: "5Y NC2",
    currency: "USD",
    notional: 390000000,
    coupon: 8.375,
    spread: 462,
    yield: 8.51,
    bid: 96.34,
    ask: 96.72,
    last: 96.48,
    dv01: 181000,
    risk: "HIGH",
    auditState: "WATCH",
    updatedAt: "2026-07-09T21:27:12.000Z",
  },
  {
    id: "DL-10542",
    folder: "audit",
    issuer: "Vantage Medical REIT",
    ticker: "VMRT",
    desk: "REIT",
    tranche: "8Y SEN",
    currency: "USD",
    notional: 610000000,
    coupon: 7.25,
    spread: 318,
    yield: 7.41,
    bid: 97.21,
    ask: 97.49,
    last: 97.31,
    dv01: 402000,
    risk: "MED",
    auditState: "BREACH",
    updatedAt: "2026-07-09T21:30:05.000Z",
  },
  {
    id: "DL-10411",
    folder: "settled",
    issuer: "Harborstone Foods",
    ticker: "HBFD",
    desk: "CONS",
    tranche: "3Y FRN",
    currency: "USD",
    notional: 285000000,
    coupon: 5.12,
    spread: 92,
    yield: 5.18,
    bid: 100.02,
    ask: 100.06,
    last: 100.04,
    dv01: 77000,
    risk: "LOW",
    auditState: "PASS",
    updatedAt: "2026-07-09T21:22:55.000Z",
  },
];

export function applyDealPatch(records: DealRecord[], patch: DealPatch): DealRecord[] {
  const existing = records.find((record) => record.id === patch.id);

  if (!existing) {
    return records;
  }

  return records.map((record) =>
    record.id === patch.id
      ? { ...record, ...patch, updatedAt: patch.updatedAt ?? new Date().toISOString() }
      : record,
  );
}

export function selectFolder(records: DealRecord[], folder: FolderKey): DealRecord[] {
  return records
    .filter((record) => record.folder === folder)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt));
}

export function computeLedgerMetrics(records: DealRecord[]) {
  const notional = records.reduce((sum, record) => sum + record.notional, 0);

  return {
    count: records.length,
    notional,
    weightedYield:
      records.reduce((sum, record) => sum + record.yield * record.notional, 0) /
      Math.max(notional, 1),
    breaches: records.filter((record) => record.auditState === "BREACH").length,
  };
}

export function makeMockPatch(records: DealRecord[], tick: number): DealPatch {
  const record = records[tick % records.length];
  const direction = tick % 2 === 0 ? 1 : -1;

  return {
    id: record.id,
    bid: roundPrice(record.bid + direction * 0.03),
    ask: roundPrice(record.ask + direction * 0.03),
    last: roundPrice(record.last + direction * 0.02),
    spread: Math.max(45, record.spread + direction * ((tick % 3) + 1)),
    yield: roundPrice(record.yield + direction * 0.01),
    updatedAt: new Date().toISOString(),
  };
}

export function formatMoney(value: number): string {
  if (value >= 1_000_000_000) {
    return `${(value / 1_000_000_000).toFixed(2)}B`;
  }

  return `${(value / 1_000_000).toFixed(0)}MM`;
}

export function formatNumber(value: number, decimals = 2): string {
  return value.toFixed(decimals);
}

export function formatClock(value: string): string {
  return new Intl.DateTimeFormat("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date(value));
}

function roundPrice(value: number): number {
  return Math.round(value * 100) / 100;
}
