import { Download, RefreshCw } from 'lucide-react';
import { StatusDot } from './StatusDot';

type ToolbarProps = {
  connected: boolean;
  lastUpdated: string;
  loading: boolean;
  onRefresh: () => void;
  onExport: () => void;
};

export function Toolbar({ connected, lastUpdated, loading, onRefresh, onExport }: ToolbarProps) {
  return (
    <div className="toolbar flex h-[56px] items-center justify-between border-b border-grid px-5 font-ledger text-ink">
      <div className="flex h-full items-center">
        <button className="toolbar-button" type="button" onClick={onRefresh} disabled={loading}>
          <RefreshCw size={20} className={loading ? 'animate-spin' : ''} />
          <span>Refresh</span>
        </button>
        <span className="mx-5 h-8 w-px bg-grid" aria-hidden="true" />
        <button className="toolbar-button" type="button" onClick={onExport}>
          <Download size={20} />
          <span>Export CSV</span>
        </button>
        <span className="mx-5 h-8 w-px bg-grid" aria-hidden="true" />
        <div className="ticker-tape" aria-hidden="true" />
      </div>

      <div className="flex items-center gap-5 text-[12px]">
        <span className="text-ink/80">Last Updated:</span>
        <strong className="tracking-[0.12em]">{lastUpdated}</strong>
        <span className="h-8 w-px bg-grid" aria-hidden="true" />
        <div className="flex items-center gap-3">
          <StatusDot connected={connected} />
          <strong>{connected ? 'Connected' : 'Reconnecting'}</strong>
        </div>
      </div>
    </div>
  );
}
