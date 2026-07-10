export const formatCurrency = (value: number, options: Intl.NumberFormatOptions = {}) =>
  new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: options.minimumFractionDigits ?? 2,
    maximumFractionDigits: options.maximumFractionDigits ?? 2,
    ...options,
  }).format(value);

export const formatWholeCurrency = (value: number) =>
  formatCurrency(value, { minimumFractionDigits: 0, maximumFractionDigits: 0 });

export const formatNumber = (value: number) => new Intl.NumberFormat('en-US').format(value);

export const formatSignedPercent = (value: number) => {
  const sign = value > 0 ? '+' : '';
  return `${sign}${value.toFixed(2)}%`;
};

export const formatSignedCurrency = (value: number) => {
  const formatted = formatCurrency(Math.abs(value));
  return value < 0 ? `$-${formatted.replace('$', '')}` : formatted;
};
