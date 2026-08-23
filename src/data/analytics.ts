import type { ActivityItem, StockMovement } from '../types';

export const revenueSeries = [
{ month: 'Jan', revenue: 412000, orders: 198, aov: 2081 },
{ month: 'Feb', revenue: 468000, orders: 221, aov: 2118 },
{ month: 'Mar', revenue: 531000, orders: 244, aov: 2176 },
{ month: 'Apr', revenue: 498000, orders: 232, aov: 2147 },
{ month: 'May', revenue: 604000, orders: 271, aov: 2229 },
{ month: 'Jun', revenue: 662000, orders: 289, aov: 2291 },
{ month: 'Jul', revenue: 728000, orders: 314, aov: 2318 },
{ month: 'Aug', revenue: 812000, orders: 348, aov: 2333 }];


export const weekSeries = [
{ day: 'Mon', orders: 38, delivered: 31, returned: 2 },
{ day: 'Tue', orders: 44, delivered: 36, returned: 1 },
{ day: 'Wed', orders: 51, delivered: 42, returned: 3 },
{ day: 'Thu', orders: 47, delivered: 40, returned: 2 },
{ day: 'Fri', orders: 62, delivered: 49, returned: 4 },
{ day: 'Sat', orders: 71, delivered: 58, returned: 3 },
{ day: 'Sun', orders: 55, delivered: 47, returned: 2 }];


export const categorySplit = [
{ name: 'Wall Décor', value: 42, revenue: 341000 },
{ name: 'Door Curtains', value: 31, revenue: 251700 },
{ name: 'Decorative Arts', value: 21, revenue: 170500 },
{ name: 'Seasonal', value: 6, revenue: 48800 }];


export const customerGrowth = [
{ month: 'Mar', newCustomers: 148, returning: 96 },
{ month: 'Apr', newCustomers: 162, returning: 118 },
{ month: 'May', newCustomers: 191, returning: 134 },
{ month: 'Jun', newCustomers: 204, returning: 158 },
{ month: 'Jul', newCustomers: 233, returning: 181 },
{ month: 'Aug', newCustomers: 271, returning: 214 }];


export const stockMovements: StockMovement[] = [
{ id: 'sm-1', sku: 'TGD-PD-2043', product: 'Zari Embroidered Door Porda — Pair', change: -3, reason: 'Order TGD-10481', by: 'System', at: '23 Aug, 08:35' },
{ id: 'sm-2', sku: 'TGD-WA-1001', product: 'Terracotta Abstract Canvas — Large', change: +25, reason: 'Purchase order PO-338', by: 'Rezaul K.', at: '22 Aug, 16:10' },
{ id: 'sm-3', sku: 'TGD-CR-4410', product: 'Handmade Ceramic Vase Set of 3', change: -4, reason: 'Damaged in transit', by: 'Rezaul K.', at: '22 Aug, 12:02' },
{ id: 'sm-4', sku: 'TGD-MC-5120', product: 'Woven Macramé Wall Hanging', change: -6, reason: 'Order TGD-10476', by: 'System', at: '21 Aug, 14:20' },
{ id: 'sm-5', sku: 'TGD-PD-2088', product: 'Sheer Linen Door Porda — Ivory', change: +40, reason: 'Restock from Narayanganj unit', by: 'Shabnam A.', at: '20 Aug, 09:45' }];


export const activity: ActivityItem[] = [
{ id: 'a-1', actor: 'Nusrat Jahan', action: 'placed order', target: 'TGD-10482', at: '9 min ago', kind: 'order' },
{ id: 'a-2', actor: 'Rezaul K.', action: 'restocked', target: 'TGD-WA-1001 · +25 units', at: '48 min ago', kind: 'product' },
{ id: 'a-3', actor: 'Farhana Rahman', action: 'left a 5★ review on', target: 'Zari Embroidered Door Porda', at: '2 hrs ago', kind: 'review' },
{ id: 'a-4', actor: 'Shabnam A.', action: 'created coupon', target: 'PORDA15', at: '5 hrs ago', kind: 'coupon' },
{ id: 'a-5', actor: 'Imran Hossain', action: 'registered as a customer', target: 'Dhaka', at: 'Yesterday', kind: 'customer' },
{ id: 'a-6', actor: 'Shabnam A.', action: 'published banner', target: 'Eid Home Refresh', at: 'Yesterday', kind: 'coupon' }];