import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  SearchIcon,
  BellIcon,
  PlusIcon,
  ChevronDownIcon,
  PackagePlusIcon,
  TicketPercentIcon,
  ShoppingBagIcon,
  UserIcon,
  SettingsIcon,
  LogOutIcon,
  AlertTriangleIcon,
  StarIcon } from
'lucide-react';

const notifications = [
{ id: 1, icon: ShoppingBagIcon, title: 'New order TGD-10482', meta: 'Nusrat Jahan · ৳9,320', at: '9 min ago', tone: 'text-brown' },
{ id: 2, icon: AlertTriangleIcon, title: 'Low stock: Zari Porda', meta: 'Only 6 pairs left', at: '1 hr ago', tone: 'text-gold' },
{ id: 3, icon: StarIcon, title: '2 reviews awaiting approval', meta: 'Porda & Ceramic Vase Set', at: '2 hrs ago', tone: 'text-terracotta' }];


const panel =
'absolute right-0 top-[calc(100%+8px)] z-40 rounded-xl border border-line bg-surface shadow-pop overflow-hidden';
const motionProps = {
  initial: { opacity: 0, y: -6, scale: 0.98 },
  animate: { opacity: 1, y: 0, scale: 1 },
  exit: { opacity: 0, y: -6, scale: 0.98 },
  transition: { duration: 0.16, ease: [0.23, 1, 0.32, 1] as [number, number, number, number] }
};

export function Topbar({ onLogout }: {onLogout: () => void;}) {
  const [open, setOpen] = useState<'quick' | 'bell' | 'profile' | null>(null);
  const [query, setQuery] = useState('');
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const onDown = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(null);
    };
    document.addEventListener('mousedown', onDown);
    return () => document.removeEventListener('mousedown', onDown);
  }, []);

  const go = (to: string) => {
    setOpen(null);
    navigate(to);
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b border-line bg-surface/90 px-4 backdrop-blur-md lg:px-6">
      <div className="relative hidden max-w-md flex-1 md:block">
        <SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-30" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search orders, products, customers…"
          aria-label="Global search"
          className="h-10 w-full rounded-lg border border-line bg-canvas pl-9 pr-16 text-sm text-ink placeholder:text-ink-30 focus:border-brown-soft focus:bg-surface focus:outline-none focus:ring-2 focus:ring-brown/15" />
        
        <kbd className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 rounded border border-line bg-cream px-1.5 py-0.5 text-[10px] font-medium text-ink-50">
          ⌘K
        </kbd>
      </div>

      <div ref={ref} className="ml-auto flex items-center gap-2">
        <div className="relative">
          <button
            onClick={() => setOpen(open === 'quick' ? null : 'quick')}
            aria-expanded={open === 'quick'}
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-ink px-3.5 text-[13px] font-medium text-white transition-colors duration-150 ease-out hover:bg-ink/90">
            
            <PlusIcon className="h-4 w-4" />
            <span className="hidden sm:inline">Quick action</span>
            <ChevronDownIcon className="h-3.5 w-3.5 opacity-70" />
          </button>
          <AnimatePresence>
            {open === 'quick' ?
            <motion.div {...motionProps} className={`${panel} w-56 p-1.5`}>
                {[
              { label: 'Add Product', icon: PackagePlusIcon, to: '/products/new' },
              { label: 'View Orders', icon: ShoppingBagIcon, to: '/orders' },
              { label: 'Create Coupon', icon: TicketPercentIcon, to: '/coupons' }].
              map((a) =>
              <button
                key={a.label}
                onClick={() => go(a.to)}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-70 transition-colors duration-150 ease-out hover:bg-cream hover:text-ink">
                
                    <a.icon className="h-4 w-4 text-ink-50" />
                    {a.label}
                  </button>
              )}
              </motion.div> :
            null}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen(open === 'bell' ? null : 'bell')}
            aria-label="Notifications"
            aria-expanded={open === 'bell'}
            className="relative flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-surface text-ink-70 transition-colors duration-150 ease-out hover:bg-cream">
            
            <BellIcon className="h-[18px] w-[18px]" />
            <span className="absolute right-2 top-2 h-2 w-2 rounded-full border-2 border-surface bg-terracotta" />
          </button>
          <AnimatePresence>
            {open === 'bell' ?
            <motion.div {...motionProps} className={`${panel} w-80`}>
                <p className="border-b border-line px-4 py-3 text-[13px] font-semibold text-ink">Notifications</p>
                <ul>
                  {notifications.map((n) =>
                <li key={n.id} className="flex gap-3 border-b border-line px-4 py-3 last:border-0 hover:bg-cream/50">
                      <n.icon className={`mt-0.5 h-4 w-4 shrink-0 ${n.tone}`} />
                      <div className="min-w-0">
                        <p className="text-[13px] font-medium text-ink">{n.title}</p>
                        <p className="text-xs text-ink-50">{n.meta}</p>
                        <p className="mt-1 text-[11px] text-ink-30">{n.at}</p>
                      </div>
                    </li>
                )}
                </ul>
                <button className="w-full bg-cream/50 py-2.5 text-[12px] font-medium text-brown hover:bg-cream">
                  Mark all as read
                </button>
              </motion.div> :
            null}
          </AnimatePresence>
        </div>

        <div className="relative">
          <button
            onClick={() => setOpen(open === 'profile' ? null : 'profile')}
            aria-label="Admin profile"
            aria-expanded={open === 'profile'}
            className="flex items-center gap-2.5 rounded-lg border border-line bg-surface py-1 pl-1 pr-2.5 transition-colors duration-150 ease-out hover:bg-cream">
            
            <img
              src="https://i.pravatar.cc/80?u=tagdiah-admin"
              alt=""
              className="h-8 w-8 rounded-md object-cover" />
            
            <span className="hidden text-left leading-tight sm:block">
              <span className="block text-[13px] font-medium text-ink">Shabnam A.</span>
              <span className="block text-[11px] text-ink-50">Store Admin</span>
            </span>
            <ChevronDownIcon className="h-3.5 w-3.5 text-ink-30" />
          </button>
          <AnimatePresence>
            {open === 'profile' ?
            <motion.div {...motionProps} className={`${panel} w-52 p-1.5`}>
                <button
                onClick={() => go('/settings')}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-70 hover:bg-cream hover:text-ink">
                
                  <UserIcon className="h-4 w-4 text-ink-50" /> Admin profile
                </button>
                <button
                onClick={() => go('/settings')}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-ink-70 hover:bg-cream hover:text-ink">
                
                  <SettingsIcon className="h-4 w-4 text-ink-50" /> Store settings
                </button>
                <div className="my-1 h-px bg-line" />
                <button
                onClick={() => {
                  setOpen(null);
                  onLogout();
                }}
                className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13px] text-danger hover:bg-danger-tint">
                
                  <LogOutIcon className="h-4 w-4" /> Logout
                </button>
              </motion.div> :
            null}
          </AnimatePresence>
        </div>
      </div>
    </header>);

}