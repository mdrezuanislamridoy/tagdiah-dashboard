export type ProductStatus = 'Active' | 'Draft' | 'Out of Stock';

export interface Variation {
  id: string;
  type: 'Size' | 'Color';
  value: string;
  stock: number;
  priceDelta: number;
}

export interface Product {
  id: string;
  name: string;
  image: string;
  sku: string;
  category: string;
  subcategory: string;
  price: number;
  discountPrice?: number;
  stock: number;
  lowStockAt: number;
  status: ProductStatus;
  featured: boolean;
  rating: number;
  reviewCount: number;
  sold: number;
  description: string;
  seoTitle: string;
  seoDescription: string;
  variations: Variation[];
  updatedAt: string;
}

export interface Category {
  id: string;
  name: string;
  image: string;
  parent: string | null;
  products: number;
  status: 'Active' | 'Hidden';
  description: string;
}

export type OrderStatus =
'Pending' |
'Confirmed' |
'Processing' |
'Shipped' |
'Delivered' |
'Cancelled' |
'Returned';

export type PaymentStatus = 'Paid' | 'Unpaid' | 'Refunded' | 'COD';

export interface OrderLine {
  productId: string;
  name: string;
  image: string;
  variant: string;
  qty: number;
  price: number;
}

export interface TimelineEvent {
  label: string;
  at: string;
  note: string;
  done: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  customer: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  date: string;
  items: OrderLine[];
  subtotal: number;
  delivery: number;
  discount: number;
  total: number;
  payment: PaymentStatus;
  method: string;
  status: OrderStatus;
  courier: string;
  tracking: string;
  timeline: TimelineEvent[];
}

export interface Customer {
  id: string;
  name: string;
  avatar: string;
  email: string;
  phone: string;
  city: string;
  orders: number;
  spent: number;
  joined: string;
  status: 'Active' | 'Blocked' | 'New';
}

export interface Review {
  id: string;
  productId: string;
  product: string;
  productImage: string;
  customer: string;
  avatar: string;
  rating: number;
  text: string;
  date: string;
  status: 'Pending' | 'Approved' | 'Rejected';
}

export interface Coupon {
  id: string;
  code: string;
  type: 'Percentage' | 'Fixed' | 'Free Delivery';
  amount: number;
  minOrder: number;
  expires: string;
  limit: number;
  used: number;
  status: 'Active' | 'Scheduled' | 'Expired' | 'Inactive';
}

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  image: string;
  placement: 'Homepage Hero' | 'Category Strip' | 'Popup';
  starts: string;
  ends: string;
  status: 'Live' | 'Scheduled' | 'Ended';
}

export interface StockMovement {
  id: string;
  sku: string;
  product: string;
  change: number;
  reason: string;
  by: string;
  at: string;
}

export interface ActivityItem {
  id: string;
  actor: string;
  action: string;
  target: string;
  at: string;
  kind: 'order' | 'product' | 'review' | 'customer' | 'coupon';
}