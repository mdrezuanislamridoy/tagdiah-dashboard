import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from 'lucide-react';
import { classNames } from '../../utils/format';

export function TableShell({ children }: {children: React.ReactNode;}) {
  return (
    <div className="scroll-thin overflow-x-auto">
      <table className="w-full min-w-[860px] border-collapse text-left">{children}</table>
    </div>);

}

export function Th({ children, className }: {children?: React.ReactNode;className?: string;}) {
  return (
    <th
      scope="col"
      className={classNames(
        'whitespace-nowrap border-b border-line bg-cream/60 px-5 py-3 text-xs font-semibold uppercase tracking-wide text-ink-50',
        className
      )}>
      
      {children}
    </th>);

}

export function Td({ children, className }: {children?: React.ReactNode;className?: string;}) {
  return <td className={classNames('border-b border-line px-5 py-3.5 align-middle text-sm text-ink-70', className)}>{children}</td>;
}

export function Tr({ children, className }: {children: React.ReactNode;className?: string;}) {
  return <tr className={classNames('transition-colors duration-150 ease-out hover:bg-cream/50', className)}>{children}</tr>;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action





}: {icon: React.ComponentType<{className?: string;}>;title: string;description: string;action?: React.ReactNode;}) {
  return (
    <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
      <span className="mb-4 flex h-14 w-14 items-center justify-center rounded-full border border-line bg-cream text-brown">
        <Icon className="h-6 w-6" />
      </span>
      <h3 className="font-display text-lg text-ink">{title}</h3>
      <p className="mt-1.5 max-w-sm text-sm text-ink-50">{description}</p>
      {action ? <div className="mt-5">{action}</div> : null}
    </div>);

}

export function Pagination({
  page,
  pages,
  total,
  onPage





}: {page: number;pages: number;total: number;onPage: (p: number) => void;}) {
  const list = Array.from({ length: Math.max(pages, 1) }, (_, i) => i + 1).slice(0, 5);
  return (
    <nav className="flex flex-wrap items-center justify-between gap-3 px-5 py-3.5" aria-label="Pagination">
      <p className="text-[13px] text-ink-50">
        Showing <span className="font-medium text-ink-70">{total === 0 ? 0 : (page - 1) * 8 + 1}</span>–
        <span className="font-medium text-ink-70">{Math.min(page * 8, total)}</span> of{' '}
        <span className="font-medium text-ink-70">{total}</span>
      </p>
      <div className="flex items-center gap-1">
        <button
          onClick={() => onPage(Math.max(1, page - 1))}
          disabled={page === 1}
          aria-label="Previous page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink-70 transition-colors duration-150 ease-out hover:bg-cream disabled:opacity-40">
          
          <ChevronLeftIcon className="h-4 w-4" />
        </button>
        {list.map((p) =>
        <button
          key={p}
          onClick={() => onPage(p)}
          aria-current={p === page ? 'page' : undefined}
          className={classNames(
            'h-8 min-w-8 rounded-md px-2 text-[13px] font-medium transition-colors duration-150 ease-out',
            p === page ? 'bg-ink text-white' : 'border border-line text-ink-70 hover:bg-cream'
          )}>
          
            {p}
          </button>
        )}
        <button
          onClick={() => onPage(Math.min(pages, page + 1))}
          disabled={page >= pages}
          aria-label="Next page"
          className="flex h-8 w-8 items-center justify-center rounded-md border border-line text-ink-70 transition-colors duration-150 ease-out hover:bg-cream disabled:opacity-40">
          
          <ChevronRightIcon className="h-4 w-4" />
        </button>
      </div>
    </nav>);

}

export function RowSkeleton({ cols }: {cols: number;}) {
  return (
    <tr>
      {Array.from({ length: cols }).map((_, i) =>
      <td key={i} className="border-b border-line px-5 py-4">
          <div className="h-3.5 animate-pulse rounded-full bg-beige/70" style={{ width: i === 0 ? '70%' : '55%' }} />
        </td>
      )}
    </tr>);

}