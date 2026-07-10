import type { TerminalMetrics } from '../types';
import {
  formatNumber,
  formatSignedPercent,
  formatWholeCurrency,
} from '../lib/formatters';

type MetricsBarProps = {
  metrics: TerminalMetrics;
};

const trendClass = (value: number) => (value < 0 ? 'text-crimson' : 'text-audit');
const riskClass = (risk: TerminalMetrics['riskLevel']) =>
  risk === 'HIGH' ? 'text-crimson' : risk === 'MEDIUM' ? 'text-[#EF6C00]' : 'text-audit';

export function MetricsBar({ metrics }: MetricsBarProps) {
  return (
    <section className="terminal-panel metrics-grid">
      <Metric
        label="Daily PNL"
        value={formatWholeCurrency(metrics.dailyPnl)}
        note="+2.41% UP"
        tone="positive"
      />
      <Metric
        label="Active Positions"
        value={formatNumber(metrics.activePositions)}
        note={`vs prev. ${formatNumber(metrics.previousPositions)}`}
      />
      <Metric
        label="Gross Exposure"
        value={formatWholeCurrency(metrics.grossExposure)}
        note={formatSignedPercent(metrics.exposureDelta)}
        tone="positive"
      />
      <Metric
        label="Risk Level"
        value={metrics.riskLevel}
        valueClass={riskClass(metrics.riskLevel)}
        note={`Score ${metrics.riskScore} / 100`}
      />
      <Metric
        label="Cash Balance"
        value={formatWholeCurrency(metrics.cashBalance)}
        note={`${formatSignedPercent(metrics.cashDelta)} DOWN`}
        tone={metrics.cashDelta < 0 ? 'negative' : 'positive'}
      />
      <Metric label="Last Updated" value={metrics.lastUpdated} note={metrics.lastUpdatedDate} />
    </section>
  );
}

type MetricProps = {
  label: string;
  value: string;
  note: string;
  tone?: 'positive' | 'negative';
  valueClass?: string;
};

function Metric({ label, value, note, tone, valueClass = 'text-ink' }: MetricProps) {
  return (
    <div className="metric-cell min-w-0 px-7 py-5 font-ledger text-ink">
      <div className="metric-label text-[12px] uppercase tracking-[0.08em]">{label}</div>
      <div className={`mt-3 truncate text-[19px] font-semibold tracking-[0.06em] ${valueClass}`}>
        {value}
      </div>
      <div
        className={`mt-3 text-[12px] tracking-[0.06em] ${
          tone ? trendClass(tone === 'negative' ? -1 : 1) : 'text-ink/82'
        }`}
      >
        {note}
      </div>
    </div>
  );
}
