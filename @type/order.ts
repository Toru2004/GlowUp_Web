import type { Voucher } from './voucher';

export interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

export interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  created_at: string;
  payment_method: string;
  payment_status: string;
  address: string;
  phone: string;
  items: OrderItem[];
  voucher: Voucher | null;
}
