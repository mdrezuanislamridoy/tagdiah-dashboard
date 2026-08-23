import React from 'react';
import { classNames } from '../../utils/format';

type Variant = 'primary' | 'secondary' | 'ghost' | 'accent' | 'danger';
type Size = 'sm' | 'md';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  icon?: React.ComponentType<{className?: string;}>;
}

const base =
'inline-flex items-center justify-center gap-2 rounded-lg font-medium whitespace-nowrap transition-[background-color,color,border-color,box-shadow,transform] duration-150 ease-out active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2 focus-visible:ring-offset-canvas disabled:opacity-50 disabled:pointer-events-none';

const variants: Record<Variant, string> = {
  primary: 'bg-ink text-white hover:bg-ink/90',
  secondary: 'bg-surface text-ink border border-line hover:bg-cream',
  ghost: 'text-ink-70 hover:bg-cream hover:text-ink',
  accent: 'bg-terracotta text-white hover:bg-terracotta/90',
  danger: 'bg-danger text-white hover:bg-danger/90'
};

const sizes: Record<Size, string> = {
  sm: 'h-9 px-3 text-[13px]',
  md: 'h-10 px-4 text-sm'
};

export function Button({ variant = 'primary', size = 'md', icon: Icon, className, children, ...rest }: ButtonProps) {
  return (
    <button className={classNames(base, variants[variant], sizes[size], className)} {...rest}>
      {Icon ? <Icon className="h-4 w-4" /> : null}
      {children}
    </button>);

}

interface IconButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label: string;
  icon: React.ComponentType<{className?: string;}>;
}

export function IconButton({ label, icon: Icon, className, ...rest }: IconButtonProps) {
  return (
    <button
      aria-label={label}
      title={label}
      className={classNames(
        'inline-flex h-9 w-9 items-center justify-center rounded-lg border border-line bg-surface text-ink-70 transition-colors duration-150 ease-out hover:bg-cream hover:text-ink focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold',
        className
      )}
      {...rest}>
      
      <Icon className="h-4 w-4" />
    </button>);

}