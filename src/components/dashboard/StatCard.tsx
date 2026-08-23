import React from 'react';
import { TrendingDownIcon, TrendingUpIcon } from 'lucide-react';
import { classNames } from '../../utils/format';

export function StatCard({
  label,
  value,
  delta,
  caption,
  icon: Icon,
  emphasis = false







}: {label: string;value: string;delta: number;caption: string;icon: React.ComponentType<{className?: string;}>;emphasis?: boolean;}) {
  const up = delta >= 0;
  const Trend = up ? TrendingUpIcon : TrendingDownIcon;
  return (
    <div
      className={classNames(
        'flex flex-col rounded-2xl border p-5 shadow-card',
        emphasis ? 'border-ink/10 bg-ink text-cream' : 'border-line bg-surface'
      )}>
      
      <div className="flex items-center justify-between">
        <p className={classNames('text-[13px] font-medium', emphasis ? 'text-cream/70' : 'text-ink-50')}>{label}</p>
        <span
          className={classNames(
            'flex h-8 w-8 items-center justify-center rounded-lg',
            emphasis ? 'bg-white/10 text-gold' : 'bg-cream text-brown'
          )}>
          
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p
        className={classNames(
          'mt-4 font-display tracking-tight',
          emphasis ? 'text-[34px] leading-none text-white' : 'text-[26px] leading-none text-ink'
        )}>
        
        {value}
      </p>
      <div className="mt-auto flex items-center gap-2 pt-4">
        <span
          className={classNames(
            'inline-flex items-center gap-1 rounded-full px-1.5 py-0.5 text-[11px] font-semibold',
            up ?
            emphasis ?
            'bg-sage/25 text-sage-tint' :
            'bg-sage-tint text-sage' :
            emphasis ?
            'bg-danger/25 text-danger-tint' :
            'bg-danger-tint text-danger'
          )}>
          
          <Trend className="h-3 w-3" />
          {up ? '+' : ''}
          {delta}%
        </span>
        <span className={classNames('truncate text-[12px]', emphasis ? 'text-cream/60' : 'text-ink-50')}>{caption}</span>
      </div>
    </div>);

}