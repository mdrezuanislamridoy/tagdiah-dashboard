import type { Customer } from '../types';

const av = (seed: string) => `https://i.pravatar.cc/120?u=tagdiah-${seed}`;

export const customers: Customer[] = [
{
  id: 'cu-01',
  name: 'Nusrat Jahan',
  avatar: av('nusrat'),
  email: 'nusrat.j@gmail.com',
  phone: '+880 1711 204 883',
  city: 'Dhaka',
  orders: 14,
  spent: 84200,
  joined: '2024-03-11',
  status: 'Active'
},
{
  id: 'cu-02',
  name: 'Tanvir Ahmed',
  avatar: av('tanvir'),
  email: 'tanvir.ahmed@outlook.com',
  phone: '+880 1912 776 501',
  city: 'Chattogram',
  orders: 9,
  spent: 52950,
  joined: '2024-07-02',
  status: 'Active'
},
{
  id: 'cu-03',
  name: 'Farhana Rahman',
  avatar: av('farhana'),
  email: 'farhana.r@gmail.com',
  phone: '+880 1611 330 129',
  city: 'Sylhet',
  orders: 21,
  spent: 137400,
  joined: '2023-11-19',
  status: 'Active'
},
{
  id: 'cu-04',
  name: 'Imran Hossain',
  avatar: av('imran'),
  email: 'imran.h@yahoo.com',
  phone: '+880 1811 902 447',
  city: 'Dhaka',
  orders: 2,
  spent: 7300,
  joined: '2026-08-09',
  status: 'New'
},
{
  id: 'cu-05',
  name: 'Sadia Islam',
  avatar: av('sadia'),
  email: 'sadia.islam@gmail.com',
  phone: '+880 1533 118 020',
  city: 'Khulna',
  orders: 6,
  spent: 31800,
  joined: '2025-01-24',
  status: 'Active'
},
{
  id: 'cu-06',
  name: 'Rakib Chowdhury',
  avatar: av('rakib'),
  email: 'rakib.c@gmail.com',
  phone: '+880 1722 645 118',
  city: 'Rajshahi',
  orders: 1,
  spent: 2100,
  joined: '2026-05-30',
  status: 'Blocked'
},
{
  id: 'cu-07',
  name: 'Mehjabin Karim',
  avatar: av('mehjabin'),
  email: 'mehjabin.k@gmail.com',
  phone: '+880 1999 471 265',
  city: 'Dhaka',
  orders: 11,
  spent: 96500,
  joined: '2024-09-15',
  status: 'Active'
},
{
  id: 'cu-08',
  name: 'Arif Mahmud',
  avatar: av('arif'),
  email: 'arif.mahmud@gmail.com',
  phone: '+880 1877 553 991',
  city: 'Cumilla',
  orders: 4,
  spent: 18650,
  joined: '2025-06-08',
  status: 'Active'
}];