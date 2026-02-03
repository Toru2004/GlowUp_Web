import { ref } from 'vue';

interface OrderItem {
  id: number;
  order_id: number;
  product_id: number;
  quantity: number;
  price: number;
}

interface Voucher {
  id: number;
  code: string;
  discount_type: string;
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  quantity: number;
  start_date: string;
  end_date: string;
  status: string;
  created_at: string;
}

interface Order {
  id: number;
  user_id: number;
  total_price: number;
  status: string;
  created_at: string;
  payment_method: string;
  address: string;
  phone: string;
  items: OrderItem[];
  voucher: Voucher | null;
}

export const useOrder = () => {
  const orders = ref<Order[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const fetchUserOrders = async (userId: number) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<{ orders: Order[] }>(`http://localhost:8081/api/orders/user/${userId}`);
      orders.value = response.orders;
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      error.value = err.data?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng.';
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchUserOrders,
  };
};
