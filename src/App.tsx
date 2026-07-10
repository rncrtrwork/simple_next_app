import { useMemo, useState } from 'react';
import { FolderTabs } from './components/FolderTabs';
import { Header } from './components/Header';
import { MetricsBar } from './components/MetricsBar';
import { TerminalTable } from './components/TerminalTable';
import { Toolbar } from './components/Toolbar';
import { viewFilters } from './data/mockTerminal';
import { useDealStream } from './hooks/useDealStream';
import type { DealRow, SortDirection, SortKey, TerminalView } from './types';

const compareValues = (a: DealRow, b: DealRow, key: SortKey) => {
  const first = a[key];
  const second = b[key];

  if (typeof first === 'number' && typeof second === 'number') {
    return first - second;
  }

  return String(first).localeCompare(String(second));
};

const csvEscape = (value: string | number) => `"${String(value).replace(/"/g, '""')}"`;

export default function App() {
  const [activeView, setActiveView] = useState<TerminalView>('positions');
  const [sortKey, setSortKey] = useState<SortKey>('account');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(25);
  const { rows, metrics, connected, loading, error, refresh } = useDealStream(activeView);

  const filteredRows = useMemo(() => rows.filter(viewFilters[activeView]), [activeView, rows]);

  const sortedRows = useMemo(() => {
    return [...filteredRows].sort((a, b) => {
      const result = compareValues(a, b, sortKey);
      return sortDirection === 'asc' ? result : -result;
    });
  }, [filteredRows, sortDirection, sortKey]);

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return sortedRows.slice(start, start + pageSize);
  }, [page, pageSize, sortedRows]);

  const setView = (view: TerminalView) => {
    setActiveView(view);
    setPage(1);
  };

  const handleSort = (key: SortKey) => {
    setSortKey((current) => {
      if (current === key) {
        setSortDirection((direction) => (direction === 'asc' ? 'desc' : 'asc'));
        return current;
      }
      setSortDirection('asc');
      return key;
    });
  };

  const handlePageSize = (nextPageSize: number) => {
    setPageSize(nextPageSize);
    setPage(1);
  };

  const exportCsv = () => {
    const header = [
      'Account',
      'Ticker',
      'Instrument',
      'Quantity',
      'Price',
      'Market Value',
      'Daily PNL',
      'Total PNL',
      'Risk',
      'Status',
    ];
    const body = sortedRows.map((row) =>
      [
        row.account,
        row.ticker,
        row.instrument,
        row.quantity,
        row.price,
        row.marketValue,
        row.dailyPnl,
        row.totalPnl,
        row.risk,
        row.status,
      ]
        .map(csvEscape)
        .join(','),
    );
    const csv = [header.join(','), ...body].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${activeView}-ledger-export.csv`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <main className="app-viewport overflow-hidden bg-canvas px-4 py-5 text-ink">
      <div className="app-frame mx-auto flex w-full max-w-[1530px] flex-col">
        <Header />
        <FolderTabs activeView={activeView} onChange={setView} />

        <section className="terminal-shell flex min-h-0 flex-1 flex-col">
          <MetricsBar metrics={metrics} />
          <div className="ledger-window mt-3 flex min-h-0 flex-1 flex-col border border-grid bg-canvas shadow-insetLine">
            <Toolbar
              connected={connected}
              lastUpdated={metrics.lastUpdated}
              loading={loading}
              onRefresh={refresh}
              onExport={exportCsv}
            />
            {error && (
              <div className="border-b border-grid bg-[#FFF8F8] px-5 py-2 font-ledger text-[12px] text-crimson">
                {error}
              </div>
            )}
            <TerminalTable
              rows={paginatedRows}
              allRowCount={sortedRows.length}
              page={page}
              pageSize={pageSize}
              sortKey={sortKey}
              sortDirection={sortDirection}
              onSort={handleSort}
              onPageChange={setPage}
              onPageSizeChange={handlePageSize}
            />
          </div>
        </section>
      </div>
    </main>
  );
}
