import {
  computeLedgerMetrics,
  folders,
  formatClock,
  formatMoney,
  formatNumber,
  selectFolder,
  type DealRecord,
  type FolderKey,
  type StreamState,
} from "../domain/deals";

type TerminalProps = {
  records: DealRecord[];
  activeFolder: FolderKey;
  onFolderChange: (folder: FolderKey) => void;
  streamState: StreamState;
  lastError?: string | null;
};

const columns = [
  "Deal ID",
  "Issuer",
  "Desk",
  "Tranche",
  "Notional",
  "Cpn",
  "Sprd",
  "Yld",
  "Bid",
  "Ask",
  "Last",
  "DV01",
  "Audit",
  "Time",
];

export function Terminal({
  records,
  activeFolder,
  onFolderChange,
  streamState,
  lastError,
}: TerminalProps) {
  const visibleRecords = selectFolder(records, activeFolder);
  const metrics = computeLedgerMetrics(visibleRecords);

  return (
    <main className="min-h-screen bg-paper text-ink">
      <section className="mx-auto flex min-h-screen w-full max-w-[1680px] flex-col px-4 py-4 sm:px-6 lg:px-8">
        <header className="terminal-header border border-ink bg-paper">
          <div className="flex flex-col border-b border-ink lg:flex-row lg:items-end lg:justify-between">
            <div className="px-4 pb-3 pt-4 sm:px-5">
              <p className="m-0 font-ledger text-[0.68rem] uppercase text-ink/70">
                AURUM LEDGER TERMINAL // RLS ISOLATED DEAL TAPE
              </p>
              <h1 className="mt-1 text-2xl font-semibold tracking-normal text-ink sm:text-3xl">
                Institutional Credit Ledger
              </h1>
            </div>
            <div className="grid grid-cols-2 border-t border-ink font-ledger text-xs sm:grid-cols-4 lg:border-l lg:border-t-0">
              <Metric label="ROWS" value={String(metrics.count).padStart(2, "0")} />
              <Metric label="NOTIONAL" value={formatMoney(metrics.notional)} />
              <Metric label="WTD YLD" value={`${formatNumber(metrics.weightedYield)}%`} />
              <Metric
                label="BREACH"
                value={String(metrics.breaches)}
                tone={metrics.breaches > 0 ? "bad" : "good"}
              />
            </div>
          </div>

          <nav className="folder-rail" aria-label="Filing folders">
            {folders.map((folder) => {
              const count = selectFolder(records, folder.key).length;
              const active = folder.key === activeFolder;

              return (
                <button
                  key={folder.key}
                  className="folder-tab"
                  data-active={active}
                  type="button"
                  onClick={() => onFolderChange(folder.key)}
                  aria-pressed={active}
                >
                  <span className="folder-tab-code">{folder.ledgerCode}</span>
                  <span>{folder.label}</span>
                  <span className="folder-tab-count">{String(count).padStart(2, "0")}</span>
                </button>
              );
            })}
          </nav>
        </header>

        <section className="flex min-h-0 flex-1 flex-col border-x border-b border-ink bg-white">
          <div className="grid grid-cols-1 border-b border-ink bg-paper font-ledger text-xs sm:grid-cols-[1fr_auto]">
            <div className="flex min-w-0 flex-wrap items-center gap-x-5 gap-y-1 px-3 py-2">
              <StatusLamp state={streamState} />
              <span>
                FILTER: {folders.find((folder) => folder.key === activeFolder)?.label.toUpperCase()}
              </span>
              <span>TENANT WALL: ENFORCED</span>
              <span>FONT SCALE: FIXED</span>
            </div>
            <div className="border-t border-ink px-3 py-2 text-ink/70 sm:border-l sm:border-t-0">
              {lastError ? `STREAM NOTE: ${lastError}` : "STREAM NOTE: NOMINAL"}
            </div>
          </div>

          <div className="ledger-scroll min-h-0 flex-1 overflow-auto">
            <table className="ledger-table w-full border-collapse font-ledger text-[0.76rem]">
              <thead>
                <tr>
                  {columns.map((column) => (
                    <th key={column} scope="col">
                      {column}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {visibleRecords.map((record) => (
                  <LedgerRow key={record.id} record={record} />
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </section>
    </main>
  );
}

function Metric({
  label,
  value,
  tone,
}: {
  label: string;
  value: string;
  tone?: "good" | "bad";
}) {
  return (
    <div className="min-w-[8.25rem] border-r border-ink px-3 py-3 last:border-r-0">
      <p className="m-0 text-[0.62rem] text-ink/60">{label}</p>
      <p
        className={
          tone === "bad"
            ? "m-0 text-base font-semibold text-crimson"
            : tone === "good"
              ? "m-0 text-base font-semibold text-audit"
              : "m-0 text-base font-semibold text-ink"
        }
      >
        {value}
      </p>
    </div>
  );
}

function StatusLamp({ state }: { state: StreamState }) {
  const label =
    state === "live"
      ? "STREAM: LIVE"
      : state === "replaying"
        ? "STREAM: LOCAL REPLAY"
        : state === "offline"
          ? "STREAM: OFFLINE"
          : "STREAM: CONNECTING";

  return <span className={`status-lamp status-${state}`}>{label}</span>;
}

function LedgerRow({ record }: { record: DealRecord }) {
  return (
    <tr>
      <td>{record.id}</td>
      <td className="issuer-cell">{record.issuer}</td>
      <td>{record.desk}</td>
      <td>{record.tranche}</td>
      <td className="numeric">{formatMoney(record.notional)}</td>
      <td className="numeric">{formatNumber(record.coupon, 3)}</td>
      <td className="numeric">{record.spread}</td>
      <td className="numeric">{formatNumber(record.yield)}</td>
      <td className="numeric">{formatNumber(record.bid)}</td>
      <td className="numeric">{formatNumber(record.ask)}</td>
      <td className="numeric">{formatNumber(record.last)}</td>
      <td className="numeric">{formatMoney(record.dv01)}</td>
      <td>
        <span className={`audit-pill audit-${record.auditState.toLowerCase()}`}>
          {record.auditState}
        </span>
      </td>
      <td>{formatClock(record.updatedAt)}</td>
    </tr>
  );
}
