export function bdt(value: number, compact = false): string {
  if (compact) {
    if (value >= 100000) return `৳${(value / 100000).toFixed(value >= 1000000 ? 1 : 2)}L`;
    if (value >= 1000) return `৳${(value / 1000).toFixed(1)}k`;
  }
  return `৳${value.toLocaleString('en-US')}`;
}

export function shortDate(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });
}

export function initials(name: string): string {
  return name.
  split(' ').
  slice(0, 2).
  map((n) => n[0]).
  join('').
  toUpperCase();
}

export function classNames(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}