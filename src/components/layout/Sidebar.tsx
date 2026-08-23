import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboardIcon,
  PackageIcon,
  LayersIcon,
  ShoppingBagIcon,
  UsersIcon,
  StarIcon,
  TicketPercentIcon,
  ImageIcon,
  WarehouseIcon,
  BarChart3Icon,
  SettingsIcon,
  LogOutIcon } from
'lucide-react';
import { classNames } from '../../utils/format';

interface NavItem {
  to: string;
  label: string;
  icon: React.ComponentType<{className?: string;}>;
  badge?: string;
}

const groups: {heading: string;items: NavItem[];}[] = [
{
  heading: 'Overview',
  items: [{ to: '/', label: 'Dashboard', icon: LayoutDashboardIcon }]
},
{
  heading: 'Catalogue',
  items: [
  { to: '/products', label: 'Products', icon: PackageIcon },
  { to: '/categories', label: 'Categories', icon: LayersIcon },
  { to: '/inventory', label: 'Inventory', icon: WarehouseIcon, badge: '3' }]

},
{
  heading: 'Selling',
  items: [
  { to: '/orders', label: 'Orders', icon: ShoppingBagIcon, badge: '12' },
  { to: '/customers', label: 'Customers', icon: UsersIcon },
  { to: '/reviews', label: 'Reviews', icon: StarIcon, badge: '2' }]

},
{
  heading: 'Marketing',
  items: [
  { to: '/coupons', label: 'Coupons & Discounts', icon: TicketPercentIcon },
  { to: '/banners', label: 'Banners / Promotions', icon: ImageIcon }]

},
{
  heading: 'Insights',
  items: [
  { to: '/analytics', label: 'Reports & Analytics', icon: BarChart3Icon },
  { to: '/settings', label: 'Settings', icon: SettingsIcon }]

}];


export function Sidebar({ onLogout }: {onLogout: () => void;}) {
  return (
    <aside className="hidden w-[248px] shrink-0 flex-col border-r border-line bg-surface lg:flex">
      <div className="flex items-center gap-3 px-5 py-5">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink font-display text-lg text-cream">T</span>
        <div className="leading-tight">
          <p className="font-display text-[15px] text-ink">Tagdiah</p>
          <p className="text-[11px] uppercase tracking-[0.14em] text-ink-30">Home Decor &amp; Arts</p>
        </div>
      </div>

      <nav className="scroll-thin flex-1 overflow-y-auto px-3 pb-4" aria-label="Main">
        {groups.map((group) =>
        <div key={group.heading} className="mb-5">
            <p className="mb-1.5 px-2 text-[10px] font-semibold uppercase tracking-[0.16em] text-ink-30">{group.heading}</p>
            <ul className="space-y-0.5">
              {group.items.map((item) =>
            <li key={item.to}>
                  <NavLink
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                classNames(
                  'group relative flex items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] transition-colors duration-150 ease-out',
                  isActive ? 'bg-cream font-medium text-ink' : 'text-ink-70 hover:bg-cream/60 hover:text-ink'
                )
                }>
                
                    {({ isActive }) =>
                <>
                        <span
                    className={classNames(
                      'absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-terracotta transition-opacity duration-150',
                      isActive ? 'opacity-100' : 'opacity-0'
                    )} />
                  
                        <item.icon className={classNames('h-[18px] w-[18px]', isActive ? 'text-brown' : 'text-ink-50')} />
                        <span className="flex-1 truncate">{item.label}</span>
                        {item.badge ?
                  <span className="rounded-full bg-terracotta-tint px-1.5 py-0.5 text-[10px] font-semibold text-terracotta">
                            {item.badge}
                          </span> :
                  null}
                      </>
                }
                  </NavLink>
                </li>
            )}
            </ul>
          </div>
        )}
      </nav>

      <div className="border-t border-line p-3">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-lg px-2.5 py-2 text-[13.5px] text-ink-70 transition-colors duration-150 ease-out hover:bg-danger-tint hover:text-danger">
          
          <LogOutIcon className="h-[18px] w-[18px]" />
          Logout
        </button>
      </div>
    </aside>);

}