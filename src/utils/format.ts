export const formatBRL = (n: number) =>
  `R$ ${n.toFixed(2).replace('.', ',')}`;

export const formatPercent = (n: number) => `${Math.round(n)}%`;

export const discountPct = (original: number, promo: number) =>
  Math.max(0, Math.round((1 - promo / original) * 100));

export const greetingForHour = (h: number) => {
  if (h < 5) return 'Boa madrugada';
  if (h < 12) return 'Bom dia';
  if (h < 18) return 'Boa tarde';
  return 'Boa noite';
};

export const monthName = (m: number) => {
  const months = [
    'janeiro',
    'fevereiro',
    'março',
    'abril',
    'maio',
    'junho',
    'julho',
    'agosto',
    'setembro',
    'outubro',
    'novembro',
    'dezembro',
  ];
  return months[m] ?? '';
};

export const monthShortUpper = (m: number) => {
  const months = [
    'JAN',
    'FEV',
    'MAR',
    'ABR',
    'MAI',
    'JUN',
    'JUL',
    'AGO',
    'SET',
    'OUT',
    'NOV',
    'DEZ',
  ];
  return months[m] ?? '';
};

export const formatTimeRange = (fromIso: string, untilIso: string) => {
  const f = new Date(fromIso);
  const u = new Date(untilIso);
  const fmt = (d: Date) => `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  return `${fmt(f)} – ${fmt(u)}`;
};

export const formatHour = (iso: string) => {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}h`;
};

export const hoursUntil = (iso: string) => {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.max(0, Math.round(ms / (1000 * 60 * 60)));
};

export const isToday = (iso: string) => {
  const d = new Date(iso);
  const t = new Date();
  return d.toDateString() === t.toDateString();
};

export const isTomorrow = (iso: string) => {
  const d = new Date(iso);
  const t = new Date();
  t.setDate(t.getDate() + 1);
  return d.toDateString() === t.toDateString();
};

export const daysUntil = (iso: string) => {
  const ms = new Date(iso).getTime() - Date.now();
  return Math.ceil(ms / (1000 * 60 * 60 * 24));
};
