import type { Banner, Coupon } from '../types';
import { IMG } from './products';

export const coupons: Coupon[] = [
{ id: 'co-1', code: 'TAGDIAH10', type: 'Percentage', amount: 10, minOrder: 2000, expires: '2026-09-30', limit: 500, used: 318, status: 'Active' },
{ id: 'co-2', code: 'EIDDECOR', type: 'Fixed', amount: 500, minOrder: 4000, expires: '2026-09-12', limit: 300, used: 122, status: 'Active' },
{ id: 'co-3', code: 'FREEDHAKA', type: 'Free Delivery', amount: 0, minOrder: 1500, expires: '2026-12-31', limit: 2000, used: 1487, status: 'Active' },
{ id: 'co-4', code: 'PORDA15', type: 'Percentage', amount: 15, minOrder: 3000, expires: '2026-10-15', limit: 250, used: 0, status: 'Scheduled' },
{ id: 'co-5', code: 'WINTER24', type: 'Percentage', amount: 20, minOrder: 5000, expires: '2026-02-28', limit: 400, used: 400, status: 'Expired' },
{ id: 'co-6', code: 'VIPCLUB', type: 'Fixed', amount: 1000, minOrder: 10000, expires: '2026-11-30', limit: 100, used: 12, status: 'Inactive' }];


export const banners: Banner[] = [
{
  id: 'b-1',
  title: 'Eid Home Refresh',
  subtitle: 'Up to 25% off wall décor & porda',
  image: IMG.wallart,
  placement: 'Homepage Hero',
  starts: '2026-08-15',
  ends: '2026-09-12',
  status: 'Live'
},
{
  id: 'b-2',
  title: 'The Porda Edit',
  subtitle: 'Handpicked embroidered curtains',
  image: IMG.curtain,
  placement: 'Category Strip',
  starts: '2026-08-01',
  ends: '2026-09-30',
  status: 'Live'
},
{
  id: 'b-3',
  title: 'Winter Craft Drop',
  subtitle: 'Limited ceramic & wood pieces',
  image: IMG.vase,
  placement: 'Homepage Hero',
  starts: '2026-11-01',
  ends: '2026-12-20',
  status: 'Scheduled'
},
{
  id: 'b-4',
  title: 'First Order — Free Delivery',
  subtitle: 'Popup for new visitors in Dhaka',
  image: IMG.macrame,
  placement: 'Popup',
  starts: '2026-06-01',
  ends: '2026-07-31',
  status: 'Ended'
}];