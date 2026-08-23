import type { Order, OrderStatus } from '../types';
import { IMG } from './products';

export const orderStatuses: OrderStatus[] = [
'Pending',
'Confirmed',
'Processing',
'Shipped',
'Delivered',
'Cancelled',
'Returned'];


export const orders: Order[] = [
{
  id: 'TGD-10482',
  customerId: 'cu-01',
  customer: 'Nusrat Jahan',
  email: 'nusrat.j@gmail.com',
  phone: '+880 1711 204 883',
  address: 'House 42, Road 11, Banani',
  city: 'Dhaka 1213',
  date: '2026-08-23',
  items: [
  { productId: 'p-1001', name: 'Terracotta Abstract Canvas — Large', image: IMG.wallart, variant: '30 × 44 in', qty: 1, price: 5100 },
  { productId: 'p-1005', name: 'Woven Macramé Wall Hanging', image: IMG.macrame, variant: 'Medium', qty: 2, price: 2450 }],

  subtotal: 10000,
  delivery: 120,
  discount: 800,
  total: 9320,
  payment: 'Paid',
  method: 'bKash',
  status: 'Processing',
  courier: 'Pathao Courier',
  tracking: 'PT-99183421',
  timeline: [
  { label: 'Order placed', at: '23 Aug, 09:12', note: 'Placed via web checkout', done: true },
  { label: 'Payment confirmed', at: '23 Aug, 09:14', note: 'bKash · TrxID 8FG21KQ', done: true },
  { label: 'Processing', at: '23 Aug, 11:40', note: 'Packing at Mirpur warehouse', done: true },
  { label: 'Shipped', at: '—', note: 'Awaiting courier pickup', done: false },
  { label: 'Delivered', at: '—', note: '', done: false }]

},
{
  id: 'TGD-10481',
  customerId: 'cu-03',
  customer: 'Farhana Rahman',
  email: 'farhana.r@gmail.com',
  phone: '+880 1611 330 129',
  address: 'Flat 5B, Shahjalal Uposhohor',
  city: 'Sylhet 3100',
  date: '2026-08-23',
  items: [
  { productId: 'p-1002', name: 'Zari Embroidered Door Porda — Pair', image: IMG.curtain, variant: 'Beige', qty: 3, price: 2740 }],

  subtotal: 8220,
  delivery: 150,
  discount: 0,
  total: 8370,
  payment: 'COD',
  method: 'Cash on delivery',
  status: 'Confirmed',
  courier: 'Steadfast',
  tracking: 'SF-4410927',
  timeline: [
  { label: 'Order placed', at: '23 Aug, 08:02', note: 'Placed via mobile app', done: true },
  { label: 'Confirmed', at: '23 Aug, 08:35', note: 'Verified by phone', done: true },
  { label: 'Processing', at: '—', note: '', done: false },
  { label: 'Shipped', at: '—', note: '', done: false },
  { label: 'Delivered', at: '—', note: '', done: false }]

},
{
  id: 'TGD-10480',
  customerId: 'cu-07',
  customer: 'Mehjabin Karim',
  email: 'mehjabin.k@gmail.com',
  phone: '+880 1999 471 265',
  address: 'House 7, Block C, Bashundhara R/A',
  city: 'Dhaka 1229',
  date: '2026-08-22',
  items: [
  { productId: 'p-1003', name: 'Carved Oak Round Mirror', image: IMG.mirror, variant: '24 in', qty: 1, price: 7900 },
  { productId: 'p-1008', name: 'Clay Tealight Holder — Set of 6', image: IMG.vase, variant: 'Default', qty: 2, price: 1450 }],

  subtotal: 10800,
  delivery: 0,
  discount: 1080,
  total: 9720,
  payment: 'Paid',
  method: 'Card · Visa 4421',
  status: 'Shipped',
  courier: 'Pathao Courier',
  tracking: 'PT-99178002',
  timeline: [
  { label: 'Order placed', at: '22 Aug, 15:41', note: '', done: true },
  { label: 'Payment confirmed', at: '22 Aug, 15:42', note: 'Card · Visa 4421', done: true },
  { label: 'Processing', at: '22 Aug, 17:10', note: '', done: true },
  { label: 'Shipped', at: '23 Aug, 10:05', note: 'Picked up by Pathao', done: true },
  { label: 'Delivered', at: '—', note: 'Expected 24 Aug', done: false }]

},
{
  id: 'TGD-10479',
  customerId: 'cu-02',
  customer: 'Tanvir Ahmed',
  email: 'tanvir.ahmed@outlook.com',
  phone: '+880 1912 776 501',
  address: '18/A Nasirabad Housing Society',
  city: 'Chattogram 4000',
  date: '2026-08-22',
  items: [
  { productId: 'p-1006', name: 'Sheer Linen Door Porda — Ivory', image: IMG.curtain, variant: 'Ivory', qty: 4, price: 2100 }],

  subtotal: 8400,
  delivery: 150,
  discount: 0,
  total: 8550,
  payment: 'Paid',
  method: 'Nagad',
  status: 'Delivered',
  courier: 'Steadfast',
  tracking: 'SF-4409113',
  timeline: [
  { label: 'Order placed', at: '22 Aug, 11:20', note: '', done: true },
  { label: 'Payment confirmed', at: '22 Aug, 11:21', note: 'Nagad · TrxID 7HH02LM', done: true },
  { label: 'Processing', at: '22 Aug, 13:00', note: '', done: true },
  { label: 'Shipped', at: '22 Aug, 18:30', note: '', done: true },
  { label: 'Delivered', at: '23 Aug, 12:44', note: 'Received by customer', done: true }]

},
{
  id: 'TGD-10478',
  customerId: 'cu-05',
  customer: 'Sadia Islam',
  email: 'sadia.islam@gmail.com',
  phone: '+880 1533 118 020',
  address: '22 Sonadanga R/A, Ward 9',
  city: 'Khulna 9100',
  date: '2026-08-21',
  items: [
  { productId: 'p-1004', name: 'Handmade Ceramic Vase Set of 3', image: IMG.vase, variant: 'Mixed Neutral', qty: 1, price: 3150 }],

  subtotal: 3150,
  delivery: 150,
  discount: 0,
  total: 3300,
  payment: 'Unpaid',
  method: 'Cash on delivery',
  status: 'Pending',
  courier: '—',
  tracking: '—',
  timeline: [
  { label: 'Order placed', at: '21 Aug, 20:55', note: 'Awaiting phone verification', done: true },
  { label: 'Confirmed', at: '—', note: '', done: false },
  { label: 'Processing', at: '—', note: '', done: false },
  { label: 'Shipped', at: '—', note: '', done: false },
  { label: 'Delivered', at: '—', note: '', done: false }]

},
{
  id: 'TGD-10477',
  customerId: 'cu-08',
  customer: 'Arif Mahmud',
  email: 'arif.mahmud@gmail.com',
  phone: '+880 1877 553 991',
  address: 'Holding 91, Jhautola',
  city: 'Cumilla 3500',
  date: '2026-08-20',
  items: [
  { productId: 'p-1007', name: 'Brass Inlay Wooden Wall Panel', image: IMG.wallart, variant: '48 × 18 in', qty: 1, price: 12400 }],

  subtotal: 12400,
  delivery: 250,
  discount: 0,
  total: 12650,
  payment: 'Refunded',
  method: 'Card · Mastercard 8890',
  status: 'Cancelled',
  courier: '—',
  tracking: '—',
  timeline: [
  { label: 'Order placed', at: '20 Aug, 10:10', note: '', done: true },
  { label: 'Payment confirmed', at: '20 Aug, 10:11', note: '', done: true },
  { label: 'Cancelled', at: '20 Aug, 16:22', note: 'Customer requested cancellation', done: true },
  { label: 'Refunded', at: '21 Aug, 09:30', note: 'Full refund issued', done: true }]

},
{
  id: 'TGD-10476',
  customerId: 'cu-04',
  customer: 'Imran Hossain',
  email: 'imran.h@yahoo.com',
  phone: '+880 1811 902 447',
  address: 'Apt 3C, 14 Green Road',
  city: 'Dhaka 1205',
  date: '2026-08-19',
  items: [
  { productId: 'p-1005', name: 'Woven Macramé Wall Hanging', image: IMG.macrame, variant: 'Large', qty: 1, price: 3100 }],

  subtotal: 3100,
  delivery: 120,
  discount: 310,
  total: 2910,
  payment: 'Paid',
  method: 'bKash',
  status: 'Returned',
  courier: 'Pathao Courier',
  tracking: 'PT-99171144',
  timeline: [
  { label: 'Order placed', at: '19 Aug, 14:02', note: '', done: true },
  { label: 'Delivered', at: '20 Aug, 17:50', note: '', done: true },
  { label: 'Return requested', at: '21 Aug, 11:15', note: 'Size mismatch', done: true },
  { label: 'Returned', at: '22 Aug, 16:00', note: 'Item back in warehouse', done: true }]

}];