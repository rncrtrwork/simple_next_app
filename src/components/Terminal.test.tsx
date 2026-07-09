import { fireEvent, render, screen, within } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { seedDeals } from "../domain/deals";
import { Terminal } from "./Terminal";

describe("Terminal", () => {
  it("renders the institutional ledger shell and live rows", () => {
    render(
      <Terminal
        records={seedDeals}
        activeFolder="live"
        onFolderChange={vi.fn()}
        streamState="live"
      />,
    );

    expect(screen.getByRole("heading", { name: /institutional credit ledger/i })).toBeInTheDocument();
    expect(screen.getByText("STREAM: LIVE")).toBeInTheDocument();
    expect(screen.getByText("Atlas Rail HoldCo")).toBeInTheDocument();
    expect(screen.getByText("Meridian Data Trust")).toBeInTheDocument();
    expect(screen.queryByText("Northstar Aviation")).not.toBeInTheDocument();
  });

  it("dispatches folder changes from the Manila filing tabs", () => {
    const onFolderChange = vi.fn();

    render(
      <Terminal
        records={seedDeals}
        activeFolder="live"
        onFolderChange={onFolderChange}
        streamState="replaying"
      />,
    );

    fireEvent.click(screen.getByRole("button", { name: /crd credit watch/i }));

    expect(onFolderChange).toHaveBeenCalledWith("credit");
  });

  it("renders the active audit queue with breach accounting in crimson", () => {
    render(
      <Terminal
        records={seedDeals}
        activeFolder="audit"
        onFolderChange={vi.fn()}
        streamState="replaying"
        lastError="Snapshot request failed with 401"
      />,
    );

    const row = screen.getByText("Vantage Medical REIT").closest("tr");

    expect(row).not.toBeNull();
    expect(within(row as HTMLTableRowElement).getByText("BREACH")).toBeInTheDocument();
    expect(screen.getByText(/snapshot request failed with 401/i)).toBeInTheDocument();
  });
});
