import React from 'react';

export const chartColors = {
  brown: '#8C6A4E',
  terracotta: '#BB6440',
  gold: '#B8913C',
  sage: '#5C7A5E',
  line: '#E5DCCF',
  ink50: '#8A8178'
};

export const axisStyle = { fontSize: 11, fill: chartColors.ink50, fontFamily: 'Inter, sans-serif' };

export function ChartTooltip({
  active,
  payload,
  label,
  formatter





}: {active?: boolean;payload?: Array<{name: string;value: number;color: string;}>;label?: string;formatter?: (v: number) => string;}) {
  if (!active || !payload || payload.length === 0) return null;
  return (
    <div className="rounded-lg border border-line bg-surface px-3 py-2 shadow-pop">
      <p className="mb-1 text-[11px] font-semibold uppercase tracking-wide text-ink-50">{label}</p>
      {payload.map((p) =>
      <p key={p.name} className="flex items-center gap-2 text-[13px] text-ink">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-ink-50">{p.name}</span>
          <span className="ml-auto font-medium">{formatter ? formatter(p.value) : p.value}</span>
        </p>
      )}
    </div>);

}

export function Legend({ items }: {items: {label: string;color: string;}[];}) {
  return (
    <ul className="flex flex-wrap items-center gap-4">
      {items.map((i) =>
      <li key={i.label} className="flex items-center gap-1.5 text-[12px] text-ink-50">
          <span className="h-2 w-2 rounded-full" style={{ background: i.color }} />
          {i.label}
        </li>
      )}
    </ul>);

}