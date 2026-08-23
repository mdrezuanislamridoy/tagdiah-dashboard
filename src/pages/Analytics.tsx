import React, { useState } from 'react';
import {
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  CartesianGrid,
  Bar,
  BarChart } from
'recharts';
import { DownloadIcon, CalendarDaysIcon, TrendingUpIcon } from 'lucide-react';
import { Card, CardHeader, PageHeader } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Select } from '../components/ui/Fields';
import { RevenueArea } from '../components/charts/RevenueArea';
import { OrdersBar } from '../components/charts/OrdersBar';
import { Legend, axisStyle, chartColors, ChartTooltip } from '../components/charts/ChartBits';
import { categorySplit, customerGrowth, revenueSeries } from '../data/analytics';
import { products } from '../data/products';
import { bdt } from '../utils/format';
import { useToast } from '../components/ui/Toast';

const pieColors = [chartColors.brown, chartColors.terracotta, chartColors.gold, chartColors.sage];

export function Analytics() {
  const toast = useToast();
  const [range, setRange] = useState('Last 8 months');
  const [loading, setLoading] = useState(false);

  const applyRange = (v: string) => {
    setRange(v);
    setLoading(true);
    window.setTimeout(() => setLoading(false), 900);
  };

  const best = [...products].sort((a, b) => b.sold - a.sold).slice(0, 5);
  const maxSold = best[0]?.sold ?? 1;

  return (
    <>
      <PageHeader title="Reports & Analytics" subtitle="Understand what sells, who buys, and where growth is coming from.">
        <Select label="Date range" value={range} onChange={applyRange} options={['Last 7 days', 'Last 30 days', 'Last 8 months', 'This year']} className="w-[180px]" />
        <Button variant="secondary" icon={CalendarDaysIcon}>
          Custom range
        </Button>
        <Button icon={DownloadIcon} onClick={() => toast('success', 'Report exported', `${range} performance report downloaded as PDF.`)}>
          Export report
        </Button>
      </PageHeader>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
        { k: 'Revenue', v: bdt(4715000), d: '+18.4%' },
        { k: 'Orders', v: '2,117', d: '+12.1%' },
        { k: 'Average order value', v: bdt(2228), d: '+4.6%' },
        { k: 'Conversion rate', v: '3.2%', d: '+0.4pt' }].
        map((s) =>
        <div key={s.k} className="rounded-2xl border border-line bg-surface p-5 shadow-card">
            <p className="text-[13px] text-ink-50">{s.k}</p>
            <p className="mt-2 font-display text-2xl leading-none text-ink">{loading ? <span className="inline-block h-6 w-24 animate-pulse rounded bg-beige/70" /> : s.v}</p>
            <p className="mt-3 inline-flex items-center gap-1 rounded-full bg-sage-tint px-1.5 py-0.5 text-[11px] font-semibold text-sage">
              <TrendingUpIcon className="h-3 w-3" />
              {s.d}
            </p>
          </div>
        )}
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-8">
          <CardHeader
            title="Revenue trend"
            subtitle={range}
            action={<Legend items={[{ label: 'Revenue', color: chartColors.brown }]} />} />
          
          <div className="px-3 py-4">
            <RevenueArea height={280} />
          </div>
        </Card>

        <Card className="xl:col-span-4">
          <CardHeader title="Category performance" subtitle="Share of revenue" />
          <div className="px-3 pt-4">
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie data={categorySplit} dataKey="value" nameKey="name" innerRadius={54} outerRadius={82} paddingAngle={2} stroke="none">
                  {categorySplit.map((entry, i) =>
                  <Cell key={entry.name} fill={pieColors[i % pieColors.length]} />
                  )}
                </Pie>
                <Tooltip content={<ChartTooltip formatter={(v) => `${v}%`} />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="space-y-2.5 p-5 pt-3">
            {categorySplit.map((c, i) =>
            <li key={c.name} className="flex items-center gap-2.5 text-[13px]">
                <span className="h-2.5 w-2.5 rounded-full" style={{ background: pieColors[i % pieColors.length] }} />
                <span className="flex-1 text-ink-70">{c.name}</span>
                <span className="text-ink-50">{bdt(c.revenue, true)}</span>
                <span className="w-9 text-right font-medium text-ink">{c.value}%</span>
              </li>
            )}
          </ul>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-7">
          <CardHeader
            title="Orders over time"
            subtitle="Placed vs delivered vs returned, last 7 days"
            action={
            <Legend
              items={[
              { label: 'Placed', color: chartColors.brown },
              { label: 'Delivered', color: chartColors.sage },
              { label: 'Returned', color: chartColors.terracotta }]
              } />

            } />
          
          <div className="px-3 py-4">
            <OrdersBar height={250} />
          </div>
        </Card>

        <Card className="xl:col-span-5">
          <CardHeader title="Average order value" subtitle="Monthly, in taka" />
          <div className="px-3 py-4">
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={revenueSeries} margin={{ top: 8, right: 12, left: -12, bottom: 0 }}>
                <CartesianGrid stroke={chartColors.line} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisStyle} />
                <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={52} domain={['dataMin - 100', 'dataMax + 100']} />
                <Tooltip content={<ChartTooltip formatter={(v) => bdt(v)} />} />
                <Line
                  type="monotone"
                  dataKey="aov"
                  name="Avg. order value"
                  stroke={chartColors.terracotta}
                  strokeWidth={2}
                  dot={{ r: 3, fill: chartColors.terracotta, strokeWidth: 0 }}
                  activeDot={{ r: 5 }} />
                
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 xl:grid-cols-12">
        <Card className="xl:col-span-5">
          <CardHeader
            title="Customer growth"
            subtitle="New vs returning shoppers"
            action={
            <Legend
              items={[
              { label: 'New', color: chartColors.brown },
              { label: 'Returning', color: chartColors.gold }]
              } />

            } />
          
          <div className="px-3 py-4">
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={customerGrowth} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke={chartColors.line} vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisStyle} />
                <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={40} />
                <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(140,106,78,0.06)' }} />
                <Bar dataKey="newCustomers" name="New" stackId="a" fill={chartColors.brown} maxBarSize={26} />
                <Bar dataKey="returning" name="Returning" stackId="a" fill={chartColors.gold} radius={[4, 4, 0, 0]} maxBarSize={26} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        <Card className="xl:col-span-7">
          <CardHeader title="Best-selling products" subtitle="By units sold in the selected range" />
          <ol className="divide-y divide-line">
            {best.map((p, i) =>
            <li key={p.id} className="flex items-center gap-4 px-5 py-3.5">
                <span className="w-4 font-display text-sm text-ink-30">{i + 1}</span>
                <img src={p.image} alt="" className="h-11 w-11 rounded-lg object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13.5px] font-medium text-ink">{p.name}</p>
                  <div className="mt-1.5 h-1.5 w-full max-w-xs overflow-hidden rounded-full bg-beige">
                    <div className="h-full rounded-full bg-brown" style={{ width: `${p.sold / maxSold * 100}%` }} />
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-ink">{p.sold} sold</p>
                  <p className="text-[12px] text-ink-50">{bdt((p.discountPrice ?? p.price) * p.sold, true)}</p>
                </div>
              </li>
            )}
          </ol>
        </Card>
      </div>
    </>);

}