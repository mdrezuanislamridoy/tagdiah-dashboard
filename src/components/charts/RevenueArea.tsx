import React from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { revenueSeries } from '../../data/analytics';
import { bdt } from '../../utils/format';
import { axisStyle, chartColors, ChartTooltip } from './ChartBits';

export function RevenueArea({ height = 260 }: {height?: number;}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={revenueSeries} margin={{ top: 8, right: 8, left: -8, bottom: 0 }}>
        <defs>
          <linearGradient id="revFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={chartColors.brown} stopOpacity={0.22} />
            <stop offset="100%" stopColor={chartColors.brown} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke={chartColors.line} vertical={false} />
        <XAxis dataKey="month" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis
          tickLine={false}
          axisLine={false}
          tick={axisStyle}
          width={56}
          tickFormatter={(v: number) => bdt(v, true)} />
        
        <Tooltip content={<ChartTooltip formatter={(v) => bdt(v)} />} cursor={{ stroke: chartColors.line }} />
        <Area
          type="monotone"
          dataKey="revenue"
          name="Revenue"
          stroke={chartColors.brown}
          strokeWidth={2}
          fill="url(#revFill)"
          dot={false}
          activeDot={{ r: 4, fill: chartColors.brown, stroke: '#fff', strokeWidth: 2 }} />
        
      </AreaChart>
    </ResponsiveContainer>);

}