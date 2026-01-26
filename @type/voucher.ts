export interface Voucher {
  id: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount?: number | null;
  quantity: number;
  start_date: string;
  end_date: string;
  status: "active" | "inactive";
  created_at?: string;
}
