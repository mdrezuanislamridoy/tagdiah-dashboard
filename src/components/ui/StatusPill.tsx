import React from 'react';
import { classNames } from '../../utils/format';

const tones: Record<string, string> = {
  neutral: 'bg-cream text-ink-70 border-line',
  success: 'bg-sage-tint text-sage border-sage/20',
  warn: 'bg-gold-tint text-gold border-gold/25',
  info: 'bg-brown-tint text-brown border-brown/20',
  danger: 'bg-danger-tint text-danger border-danger/20',
  accent: 'bg-terracotta-tint text-terracotta border-terracotta/20'
};

const map: Record<string, keyof typeof tones> = {
  // order
  Pending: 'warn',
  Confirmed: 'info',
  Processing: 'info',
  Shipped: 'accent',
  Delivered: 'success',
  Cancelled: 'danger',
  Returned: 'danger',
  // payment
  Paid: 'success',
  Unpaid: 'warn',
  Refunded: 'neutral',
  COD: 'info',
  // product / general
  Active: 'success',
  Draft: 'neutral',
  'Out of Stock': 'danger',
  'Low Stock': 'warn',
  'In Stock': 'success',
  Hidden: 'neutral',
  Blocked: 'danger',
  New: 'accent',
  Approved: 'success',
  Rejected: 'danger',
  Live: 'success',
  Scheduled: 'info',
  Ended: 'neutral',
  Expired: 'neutral',
  Inactive: 'neutral'
};

export function StatusPill({ status, className }: {status: string;className?: string;}) {
  const tone = tones[map[status] ?? 'neutral'];
  return (
    <span
      className={classNames(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-medium',
        tone,
        className
      )}>
      
      <span className="h-1.5 w-1.5 rounded-full bg-current opacity-70" aria-hidden="true" />
      {status}
    </span>);

}