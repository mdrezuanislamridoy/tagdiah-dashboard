import React from 'react';
import { classNames } from '../../utils/format';

export function Card({ className, children }: {className?: string;children: React.ReactNode;}) {
  return (
    <section className={classNames('rounded-2xl border border-line bg-surface shadow-card', className)}>
      {children}
    </section>);

}

export function CardHeader({
  title,
  subtitle,
  action




}: {title: string;subtitle?: string;action?: React.ReactNode;}) {
  return (
    <header className="flex items-start justify-between gap-4 border-b border-line px-5 py-4">
      <div>
        <h2 className="font-display text-[17px] leading-tight text-ink">{title}</h2>
        {subtitle ? <p className="mt-0.5 text-[13px] text-ink-50">{subtitle}</p> : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>);

}

export function PageHeader({
  title,
  subtitle,
  children




}: {title: string;subtitle?: string;children?: React.ReactNode;}) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="font-display text-2xl leading-tight text-ink">{title}</h1>
        {subtitle ? <p className="mt-1 text-sm text-ink-50">{subtitle}</p> : null}
      </div>
      {children ? <div className="flex flex-wrap items-center gap-2">{children}</div> : null}
    </div>);

}