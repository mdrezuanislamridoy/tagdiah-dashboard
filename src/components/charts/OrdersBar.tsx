import React from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { weekSeries } from '../../data/analytics';
import { axisStyle, chartColors, ChartTooltip } from './ChartBits';

export function OrdersBar({ height = 220 }: {height?: number;}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={weekSeries} margin={{ top: 8, right: 8, left: -16, bottom: 0 }} barGap={4}>
        <CartesianGrid stroke={chartColors.line} vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} tick={axisStyle} />
        <YAxis tickLine={false} axisLine={false} tick={axisStyle} width={40} />
        <Tooltip content={<ChartTooltip />} cursor={{ fill: 'rgba(140,106,78,0.06)' }} />
        <Bar dataKey="orders" name="Orders placed" fill={chartColors.brown} radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Bar dataKey="delivered" name="Delivered" fill={chartColors.sage} radius={[4, 4, 0, 0]} maxBarSize={18} />
        <Bar dataKey="returned" name="Returned" fill={chartColors.terracotta} radius={[4, 4, 0, 0]} maxBarSize={18} />
      </BarChart>
    </ResponsiveContainer>);

}