export function Header() {
  return (
    <header className="app-header flex items-start justify-between gap-6 px-1 pb-3 text-ink">
      <div className="flex items-start gap-5">
        <div className="title-bank-mark">
          <img className="title-bank-image" src="/assets/bank-icon.png" alt="" aria-hidden="true" />
        </div>
        <div>
          <h1 className="font-display text-[27px] font-semibold uppercase leading-[1.05] tracking-[0.105em]">
            Institutional Deal Terminal
          </h1>
          <p className="mt-2 font-ledger text-[12px] uppercase tracking-[0.16em] text-ink/70">
            Real-time financial data viewport
          </p>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-6 whitespace-nowrap font-ledger text-[13px] uppercase">
        <div>
          <span className="font-semibold">ENV:</span>
          <span className="ml-2 text-audit">Production</span>
        </div>
      </div>
    </header>
  );
}
