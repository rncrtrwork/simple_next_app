type StatusDotProps = {
  connected: boolean;
};

export function StatusDot({ connected }: StatusDotProps) {
  return (
    <span
      className={`inline-block h-2.5 w-2.5 rounded-full border border-ink/20 ${
        connected ? 'bg-audit' : 'bg-crimson'
      }`}
      aria-hidden="true"
    />
  );
}
