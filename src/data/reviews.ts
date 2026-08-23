import type { Review } from '../types';
import { IMG } from './products';

const av = (seed: string) => `https://i.pravatar.cc/120?u=tagdiah-${seed}`;

export const reviews: Review[] = [
{
  id: 'r-01',
  productId: 'p-1002',
  product: 'Zari Embroidered Door Porda — Pair',
  productImage: IMG.curtain,
  customer: 'Farhana Rahman',
  avatar: av('farhana'),
  rating: 5,
  text: 'The zari work is much finer than the photos suggest. Drape is heavy in a good way and the beige matches our wall paint almost exactly.',
  date: '2026-08-23',
  status: 'Pending'
},
{
  id: 'r-02',
  productId: 'p-1001',
  product: 'Terracotta Abstract Canvas — Large',
  productImage: IMG.wallart,
  customer: 'Mehjabin Karim',
  avatar: av('mehjabin'),
  rating: 5,
  text: 'Anchors our entryway perfectly. Frame arrived without a scratch and the colours are warmer in person.',
  date: '2026-08-22',
  status: 'Approved'
},
{
  id: 'r-03',
  productId: 'p-1004',
  product: 'Handmade Ceramic Vase Set of 3',
  productImage: IMG.vase,
  customer: 'Sadia Islam',
  avatar: av('sadia'),
  rating: 3,
  text: 'Lovely glaze but the smallest vase had a hairline crack near the base. Support responded quickly though.',
  date: '2026-08-21',
  status: 'Pending'
},
{
  id: 'r-04',
  productId: 'p-1005',
  product: 'Woven Macramé Wall Hanging',
  productImage: IMG.macrame,
  customer: 'Tanvir Ahmed',
  avatar: av('tanvir'),
  rating: 4,
  text: 'Good knot density and the dowel feels solid. Wish the large size were a bit wider for the price.',
  date: '2026-08-20',
  status: 'Approved'
},
{
  id: 'r-05',
  productId: 'p-1003',
  product: 'Carved Oak Round Mirror',
  productImage: IMG.mirror,
  customer: 'Nusrat Jahan',
  avatar: av('nusrat'),
  rating: 5,
  text: 'Genuinely hand-carved — you can feel the tool marks. Heavier than expected so use proper wall anchors.',
  date: '2026-08-19',
  status: 'Approved'
},
{
  id: 'r-06',
  productId: 'p-1006',
  product: 'Sheer Linen Door Porda — Ivory',
  productImage: IMG.curtain,
  customer: 'Rakib Chowdhury',
  avatar: av('rakib'),
  rating: 1,
  text: 'Delivery took nine days and nobody picked up the hotline. Product itself is fine.',
  date: '2026-08-18',
  status: 'Rejected'
}];