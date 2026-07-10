import { ArrowUpDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import type { ReactNode } from 'react';
import type { DealRow, SortDirection, SortKey } from '../types';
import { formatCurrency, formatNumber, formatSignedCurrency } from '../lib/formatters';

type Column = {
  key: SortKey;
  label: string;
  align?: 'left' | 'right' | 'center';
  width: string;
};

const columns: Column[] = [
  { key: 'account', label: 'Account', width: '9%' },
  { key: 'ticker', label: 'Ticker', width: '7%' },
  { key: 'instrument', label: 'Instrument', width: '16%' },
  { key: 'quantity', label: 'Quantity', align: 'right', width: '9%' },
  { key: 'price', label: 'Price', align: 'right', width: '9%' },
  { key: 'marketValue', label: 'Market Value', align: 'right', width: '12%' },
  { key: 'dailyPnl', label: 'Daily PNL', align: 'right', width: '10%' },
  { key: 'totalPnl', label: 'Total PNL', align: 'right', width: '10%' },
  { key: 'risk', label: 'Risk', align: 'center', width: '8%' },
  { key: 'status', label: 'Status', align: 'center', width: '10%' },
];

type TerminalTableProps = {
  rows: DealRow[];
  allRowCount: number;
  page: number;
  pageSize: number;
  sortKey: SortKey;
  sortDirection: SortDirection;
  onSort: (key: SortKey) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (pageSize: number) => void;
};

export function TerminalTable({
  rows,
  allRowCount,
  page,
  pageSize,
  sortKey,
  sortDirection,
  onSort,
  onPageChange,
  onPageSizeChange,
}: TerminalTableProps) {
  const pageCount = Math.max(1, Math.ceil(allRowCount / pageSize));
  const start = allRowCount === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, allRowCount);

  return (
    <>
      <div className="table-frame">
        <table className="terminal-table table-fixed">
          <colgroup>
            {columns.map((column) => (
              <col key={column.key} style={{ width: column.width }} />
            ))}
          </colgroup>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.key}>
                  <button
                    className={`sort-button ${
                      column.align === 'right'
                        ? 'justify-end'
                        : column.align === 'center'
                          ? 'justify-center'
                          : 'justify-start'
                    }`}
                    type="button"
                    onClick={() => onSort(column.key)}
                  >
                    <span>{column.label}</span>
                    <ArrowUpDown
                      size={12}
                      className={sortKey === column.key ? 'text-ink' : 'text-ink/38'}
                    />
                    {sortKey === column.key && (
                      <span className="sr-only">sorted {sortDirection}</span>
                    )}
                  </button>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, index) => (
              <tr key={row.id} className={index === 2 ? 'bg-[#EAF0F7]' : undefined}>
                <LedgerCell>{row.account}</LedgerCell>
                <LedgerCell>{row.ticker}</LedgerCell>
                <LedgerCell>{row.instrument}</LedgerCell>
                <LedgerCell align="right">{formatNumber(row.quantity)}</LedgerCell>
                <LedgerCell align="right">{formatCurrency(row.price)}</LedgerCell>
                <LedgerCell align="right">{formatCurrency(row.marketValue)}</LedgerCell>
                <PnlCell value={row.dailyPnl} />
                <PnlCell value={row.totalPnl} />
                <RiskCell value={row.risk} />
                <LedgerCell align="center">{row.status}</LedgerCell>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <footer className="flex h-[66px] items-center justify-between border-t border-grid px-5 font-ledger text-[13px] text-ink">
        <div className="text-ink/80">
          Showing {start} to {end} of {allRowCount} results
        </div>

        <div className="flex items-center gap-8">
          <label className="flex items-center gap-3">
            <span className="text-ink/80">Rows per page:</span>
            <select
              className="h-9 border border-grid bg-canvas px-3 text-ink outline-none"
              value={pageSize}
              onChange={(event) => onPageSizeChange(Number(event.target.value))}
            >
              <option value={10}>10</option>
              <option value={25}>25</option>
              <option value={50}>50</option>
            </select>
          </label>

          <div className="flex items-center gap-2">
            <PageButton label="First page" disabled={page === 1} onClick={() => onPageChange(1)}>
              <ChevronsLeft size={17} />
            </PageButton>
            <PageButton
              label="Previous page"
              disabled={page === 1}
              onClick={() => onPageChange(page - 1)}
            >
              <ChevronLeft size={17} />
            </PageButton>
            {Array.from({ length: Math.min(5, pageCount) }, (_, index) => index + 1).map((number) => (
              <PageButton
                key={number}
                label={`Page ${number}`}
                active={number === page}
                onClick={() => onPageChange(number)}
              >
                {number}
              </PageButton>
            ))}
            <PageButton
              label="Next page"
              disabled={page === pageCount}
              onClick={() => onPageChange(page + 1)}
            >
              <ChevronRight size={17} />
            </PageButton>
            <PageButton
              label="Last page"
              disabled={page === pageCount}
              onClick={() => onPageChange(pageCount)}
            >
              <ChevronsRight size={17} />
            </PageButton>
          </div>
        </div>
      </footer>
    </>
  );
}

type CellProps = {
  children: ReactNode;
  align?: 'left' | 'right' | 'center';
};

function LedgerCell({ children, align = 'left' }: CellProps) {
  const alignClass = align === 'right' ? 'text-right' : align === 'center' ? 'text-center' : 'text-left';
  return <td className={`ledger-cell ${alignClass}`}>{children}</td>;
}

function PnlCell({ value }: { value: number }) {
  return (
    <LedgerCell align="right">
      <span className={value < 0 ? 'text-crimson' : 'text-audit'}>{formatSignedCurrency(value)}</span>
    </LedgerCell>
  );
}

function RiskCell({ value }: { value: DealRow['risk'] }) {
  const color = value === 'HIGH' ? 'risk-high' : value === 'MEDIUM' ? 'risk-medium' : 'risk-low';
  return (
    <LedgerCell align="center">
      <span className={`risk-chip ${color}`}>{value}</span>
    </LedgerCell>
  );
}

type PageButtonProps = {
  children: ReactNode;
  label: string;
  active?: boolean;
  disabled?: boolean;
  onClick: () => void;
};

function PageButton({ children, label, active, disabled, onClick }: PageButtonProps) {
  return (
    <button
      className={`page-button ${active ? 'page-button-active' : ''}`}
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
    >
      {children}
    </button>
  );
}
