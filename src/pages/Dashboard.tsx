import React from 'react';
import { Link } from 'react-router-dom';
import {
  BanknoteIcon,
  ShoppingBagIcon,
  UsersIcon,
  PackageIcon,
  PackagePlusIcon,
  TicketPercentIcon,
  ArrowRightIcon,
  AlertTriangleIcon,
  StarIcon,
  DownloadIcon,
  CalendarDaysIcon } from
'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { StatusPill } from '../components/ui/StatusPill';
import { StatCard } from '../components/dashboard/StatCard';
import { RevenueArea } from '../components/charts/RevenueArea';
import { OrdersBar } from '../components/charts/OrdersBar';
import { Legend, chartColors } from '../components/charts/ChartBits';
import { orders } from '../data/orders';
import { products } from '../data/products';
import { reviews } from '../data/reviews';
import { activity } from '../data/analytics';
import { bdt, shortDate } from '../utils/format';
import { useToast } from '../components/ui/Toast';

const quickActions = [
{ label: 'Add Product', description: 'List a new décor piece', to: '/products/new', icon: PackagePlusIcon },
{ label: 'View Orders', description: '12 need attention today', to: '/orders', icon: ShoppingBagIcon },
{ label: 'Create Coupon', description: 'Run a seasonal offer', to: '/coupons', icon: TicketPercentIcon }];


export function Dashboard() {
  const toast = useToast();
  const recentOrders = orders.slice(0, 5);
  const topSelling = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const lowStock = products.filter((p) => p.stock <= p.lowStockAt).sort((a, b) => a.stock - b.stock);
  const recentReviews = reviews.slice(0, 3);

  return (
    <>
      <PageHeader title="Good morning, Shabnam" subtitle="Here's how Tagdiah Home Decor & Arts is performing this month.">
        <Button variant="secondary" icon={CalendarDaysIcon}>
          1 – 23 August 2026
        </Button>
        <Button
          variant="secondary"
          icon={DownloadIcon}
          onClick={() => toast('success', 'Report queued', 'August summary will arrive in your inbox shortly.')}>
          
          Export
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard label="Total sales" value={bdt(812400)} delta={11.6} caption="vs ৳728k in July" icon={BanknoteIcon} emphasis />
        <StatCard label="Total orders" value="348" delta={8.2} caption="34 placed in last 24 hrs" icon={ShoppingBagIcon} />
        <StatCard label="Total customers" value="2,486" delta={5.4} caption="271 new this month" icon={UsersIcon} />
        <StatCard label="Total products" value="164" delta={-1.8} caption="3 low on stock" icon={PackageIcon} />
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader
            title="Revenue overview"
            subtitle="Net revenue after discounts and returns, last 8 months"
            action={<Legend items={[{ label: 'Revenue', color: chartColors.brown }]} />} />
          
          <div className="px-3 py-4">
            <RevenueArea height={272} />
          </div>
          <div className="grid grid-cols-3 divide-x divide-line border-t border-line">
            {[
            { k: 'Avg. order value', v: bdt(2333) },
            { k: 'Best month', v: 'August · ' + bdt(812000, true) },
            { k: 'Return rate', v: '2.4%' }].
            map((s) =>
            <div key={s.k} className="px-5 py-3.5">
                <p className="text-[12px] text-ink-50">{s.k}</p>
                <p className="mt-0.5 text-sm font-medium text-ink">{s.v}</p>
              </div>
            )}
          </div>
        </Card>

        <div className="flex flex-col gap-4 xl:col-span-4">
          <Card>
            <CardHeader title="Quick actions" />
            <div className="p-2">
              {quickActions.map((a) =>
              <Link
                key={a.label}
                to={a.to}
                className="group flex items-center gap-3 rounded-xl px-3 py-3 transition-colors duration-150 ease-out hover:bg-cream">
                
                  <span className="flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-cream text-brown">
                    <a.icon className="h-[18px] w-[18px]" />
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-sm font-medium text-ink">{a.label}</span>
                    <span className="block truncate text-[12px] text-ink-50">{a.description}</span>
                  </span>
                  <ArrowRightIcon className="h-4 w-4 text-ink-30 transition-transform duration-150 ease-out group-hover:translate-x-0.5 group-hover:text-brown" />
                </Link>
              )}
            </div>
          </Card>

          <Card className="flex-1">
            <CardHeader title="Recent activity" />
            <ol className="p-5 pt-4">
              {activity.slice(0, 5).map((a, i, arr) =>
              <li key={a.id} className="relative flex gap-3 pb-4 last:pb-0">
                  {i < arr.length - 1 ? <span className="absolute left-[5px] top-4 h-full w-px bg-line" /> : null}
                  <span className="relative mt-1.5 h-2.5 w-2.5 shrink-0 rounded-full border-2 border-brown bg-surface" />
                  <div className="min-w-0">
                    <p className="text-[13px] leading-snug text-ink-70">
                      <span className="font-medium text-ink">{a.actor}</span> {a.action}{' '}
                      <span className="font-medium text-brown">{a.target}</span>
                    </p>
                    <p className="mt-0.5 text-[11.5px] text-ink-30">{a.at}</p>
                  </div>
                </li>
              )}
            </ol>
          </Card>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader
            title="Recent orders"
            subtitle="Latest activity across all channels"
            action={
            <Link to="/orders" className="text-[13px] font-medium text-brown hover:underline">
                View all
              </Link>
            } />
          
          <ul className="divide-y divide-line">
            {recentOrders.map((o) =>
            <li key={o.id}>
                <Link
                to={`/orders/${o.id}`}
                className="flex items-center gap-4 px-5 py-3.5 transition-colors duration-150 ease-out hover:bg-cream/50">
                
                  <img src={o.items[0].image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-ink">{o.id}</p>
                    <p className="truncate text-[12.5px] text-ink-50">
                      {o.customer} · {o.items.length} item{o.items.length > 1 ? 's' : ''} · {shortDate(o.date)}
                    </p>
                  </div>
                  <StatusPill status={o.payment} />
                  <StatusPill status={o.status} />
                  <p className="w-24 text-right text-sm font-medium text-ink">{bdt(o.total)}</p>
                </Link>
              </li>
            )}
          </ul>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader title="Top-selling products" subtitle="By units sold this month" />
          <ol className="divide-y divide-line">
            {topSelling.map((p, i) =>
            <li key={p.id} className="flex items-center gap-3 px-5 py-3">
                <span className="w-4 font-display text-sm text-ink-30">{i + 1}</span>
                <img src={p.image} alt="" className="h-10 w-10 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{p.name}</p>
                  <p className="text-[12px] text-ink-50">
                    {p.sold} sold · {bdt((p.discountPrice ?? p.price) * p.sold, true)}
                  </p>
                </div>
              </li>
            )}
          </ol>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader
            title="Order performance"
            subtitle="Placed, delivered and returned over the last 7 days"
            action={
            <Legend
              items={[
              { label: 'Placed', color: chartColors.brown },
              { label: 'Delivered', color: chartColors.sage },
              { label: 'Returned', color: chartColors.terracotta }]
              } />

            } />
          
          <div className="px-3 py-4">
            <OrdersBar height={236} />
          </div>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader
            title="Low-stock products"
            subtitle={`${lowStock.length} items at or below their reorder point`}
            action={
            <Link to="/inventory" className="text-[13px] font-medium text-brown hover:underline">
                Manage
              </Link>
            } />
          
          <ul className="divide-y divide-line">
            {lowStock.map((p) =>
            <li key={p.id} className="flex items-center gap-3 px-5 py-3.5">
                <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-gold-tint text-gold">
                  <AlertTriangleIcon className="h-4 w-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-medium text-ink">{p.name}</p>
                  <p className="text-[12px] text-ink-50">
                    {p.sku} · reorder at {p.lowStockAt}
                  </p>
                </div>
                <p className={`text-sm font-semibold ${p.stock === 0 ? 'text-danger' : 'text-gold'}`}>{p.stock} left</p>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-4">
        <Card>
          <CardHeader
            title="Recent customer reviews"
            subtitle="2 reviews are waiting for approval"
            action={
            <Link to="/reviews" className="text-[13px] font-medium text-brown hover:underline">
                Moderate reviews
              </Link>
            } />
          
          <ul className="grid grid-cols-1 divide-y divide-line lg:grid-cols-3 lg:divide-x lg:divide-y-0">
            {recentReviews.map((r) =>
            <li key={r.id} className="flex flex-col p-5">
                <div className="flex items-center gap-3">
                  <img src={r.avatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-medium text-ink">{r.customer}</p>
                    <p className="truncate text-[12px] text-ink-50">{r.product}</p>
                  </div>
                  <span className="ml-auto flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) =>
                  <StarIcon
                    key={i}
                    className={`h-3.5 w-3.5 ${i < r.rating ? 'fill-gold text-gold' : 'text-beige'}`} />

                  )}
                  </span>
                </div>
                <p className="mt-3 text-[13px] leading-relaxed text-ink-70">“{r.text}”</p>
                <div className="mt-auto flex items-center justify-between pt-4">
                  <span className="text-[11.5px] text-ink-30">{shortDate(r.date)}</span>
                  <StatusPill status={r.status} />
                </div>
              </li>
            )}
          </ul>
        </Card>
      </div>
    </>);

}