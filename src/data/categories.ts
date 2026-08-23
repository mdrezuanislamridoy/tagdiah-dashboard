import type { Category } from '../types';
import { IMG } from './products';

export const categories: Category[] = [
{
  id: 'c-1',
  name: 'Wall Décor',
  image: IMG.wallart,
  parent: null,
  products: 68,
  status: 'Active',
  description: 'Canvas art, mirrors, panels and textile hangings.'
},
{
  id: 'c-1a',
  name: 'Canvas Art',
  image: IMG.wallart,
  parent: 'Wall Décor',
  products: 31,
  status: 'Active',
  description: 'Framed and stretched canvas prints.'
},
{
  id: 'c-1b',
  name: 'Mirrors',
  image: IMG.mirror,
  parent: 'Wall Décor',
  products: 19,
  status: 'Active',
  description: 'Framed decorative wall mirrors.'
},
{
  id: 'c-1c',
  name: 'Textile Art',
  image: IMG.macrame,
  parent: 'Wall Décor',
  products: 18,
  status: 'Active',
  description: 'Macramé, weaves and fabric panels.'
},
{
  id: 'c-2',
  name: 'Door Curtains',
  image: IMG.curtain,
  parent: null,
  products: 44,
  status: 'Active',
  description: 'Porda for doorways, balconies and partitions.'
},
{
  id: 'c-2a',
  name: 'Embroidered Porda',
  image: IMG.curtain,
  parent: 'Door Curtains',
  products: 26,
  status: 'Active',
  description: 'Zari and thread embroidered curtain pairs.'
},
{
  id: 'c-2b',
  name: 'Sheer Porda',
  image: IMG.curtain,
  parent: 'Door Curtains',
  products: 18,
  status: 'Active',
  description: 'Light-diffusing sheers and nets.'
},
{
  id: 'c-3',
  name: 'Decorative Arts',
  image: IMG.vase,
  parent: null,
  products: 52,
  status: 'Active',
  description: 'Ceramics, wood craft and sculptural objects.'
},
{
  id: 'c-3a',
  name: 'Ceramics',
  image: IMG.vase,
  parent: 'Decorative Arts',
  products: 30,
  status: 'Active',
  description: 'Vases, bowls and tealight holders.'
},
{
  id: 'c-3b',
  name: 'Wood Craft',
  image: IMG.wallart,
  parent: 'Decorative Arts',
  products: 22,
  status: 'Hidden',
  description: 'Carved and inlaid wooden pieces.'
},
{
  id: 'c-4',
  name: 'Seasonal Collection',
  image: IMG.macrame,
  parent: null,
  products: 0,
  status: 'Hidden',
  description: 'Eid and winter capsule drops.'
}];


export const categoryNames = categories.filter((c) => !c.parent).map((c) => c.name);