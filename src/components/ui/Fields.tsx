import React from 'react';
import { SearchIcon, ChevronDownIcon } from 'lucide-react';
import { classNames } from '../../utils/format';

const control =
'w-full rounded-lg border border-line bg-surface px-3 text-sm text-ink placeholder:text-ink-30 transition-[border-color,box-shadow] duration-150 ease-out focus:border-brown-soft focus:outline-none focus:ring-2 focus:ring-brown/15';

export function SearchInput({
  value,
  onChange,
  placeholder = 'Search…',
  className





}: {value: string;onChange: (v: string) => void;placeholder?: string;className?: string;}) {
  return (
    <div className={classNames('relative', className)}>
      <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-30" />
      <input
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={placeholder}
        className={classNames(control, 'h-10 pl-9')} />
      
    </div>);

}

export function Select({
  value,
  onChange,
  options,
  label,
  className






}: {value: string;onChange: (v: string) => void;options: string[];label: string;className?: string;}) {
  return (
    <div className={classNames('relative', className)}>
      <select
        aria-label={label}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={classNames(control, 'h-10 appearance-none pr-9')}>
        
        {options.map((o) =>
        <option key={o} value={o}>
            {o}
          </option>
        )}
      </select>
      <ChevronDownIcon className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-30" />
    </div>);

}

export function Field({
  label,
  hint,
  error,
  required,
  children






}: {label: string;hint?: string;error?: string;required?: boolean;children: React.ReactNode;}) {
  return (
    <label className="block">
      <span className="mb-1.5 flex items-center gap-1 text-[13px] font-medium text-ink-70">
        {label}
        {required ? <span className="text-terracotta">*</span> : null}
      </span>
      {children}
      {error ?
      <span className="mt-1.5 block text-xs text-danger">{error}</span> :
      hint ?
      <span className="mt-1.5 block text-xs text-ink-50">{hint}</span> :
      null}
    </label>);

}

export function TextInput({
  invalid,
  className,
  ...rest
}: React.InputHTMLAttributes<HTMLInputElement> & {invalid?: boolean;}) {
  return <input className={classNames(control, 'h-10', invalid && 'border-danger focus:ring-danger/20', className)} {...rest} />;
}

export function TextArea({
  className,
  ...rest
}: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea className={classNames(control, 'py-2.5', className)} {...rest} />;
}

export function Toggle({
  checked,
  onChange,
  label,
  description





}: {checked: boolean;onChange: (v: boolean) => void;label: string;description?: string;}) {
  return (
    <div className="flex items-start justify-between gap-4">
      <div>
        <p className="text-sm font-medium text-ink">{label}</p>
        {description ? <p className="mt-0.5 text-[13px] text-ink-50">{description}</p> : null}
      </div>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        aria-label={label}
        onClick={() => onChange(!checked)}
        className={classNames(
          'relative mt-0.5 h-6 w-11 shrink-0 rounded-full transition-colors duration-150 ease-out focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2',
          checked ? 'bg-sage' : 'bg-beige'
        )}>
        
        <span
          className={classNames(
            'absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-card transition-transform duration-150 ease-out',
            checked ? 'translate-x-[22px]' : 'translate-x-0.5'
          )} />
        
      </button>
    </div>);

}