import { describe, expect, it } from "vitest";
import {
  applyDealPatch,
  computeLedgerMetrics,
  seedDeals,
  selectFolder,
} from "./deals";

describe("deal domain", () => {
  it("filters records by active filing folder", () => {
    const creditRows = selectFolder(seedDeals, "credit");

    expect(creditRows).toHaveLength(1);
    expect(creditRows[0].issuer).toBe("Northstar Aviation");
  });

  it("applies streaming patches without changing other rows", () => {
    const patched = applyDealPatch(seedDeals, {
      id: "DL-10482",
      bid: 101.12,
      ask: 101.24,
      updatedAt: "2026-07-09T22:00:00.000Z",
    });

    expect(patched.find((record) => record.id === "DL-10482")?.bid).toBe(101.12);
    expect(patched.find((record) => record.id === "DL-10496")?.bid).toBe(100.11);
  });

  it("computes ledger metrics for the visible rows", () => {
    const liveRows = selectFolder(seedDeals, "live");
    const metrics = computeLedgerMetrics(liveRows);

    expect(metrics.count).toBe(2);
    expect(metrics.notional).toBe(1_360_000_000);
    expect(metrics.breaches).toBe(0);
    expect(metrics.weightedYield).toBeGreaterThan(5.9);
  });
});
