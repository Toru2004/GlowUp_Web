import { ref } from 'vue';
import type { Order } from '@/@type/order';

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
      return response.orders;
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      error.value = err.data?.message || 'Có lỗi xảy ra khi tải danh sách đơn hàng.';
      return null;
    } finally {
      loading.value = false;
    }
  };

  const cancelOrder = async (orderId: number) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`http://localhost:8081/api/orders/cancel/${orderId}`, {
        method: "POST",
      });
    } catch (err: any) {
      console.error("Error cancelling order:", err);
      error.value = err.data?.message || "Có lỗi xảy ra khi hủy đơn hàng.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const fetchAllOrders = async () => {
    loading.value = true;
    error.value = null;
    try {
      const response = await $fetch<{ orders: Order[] }>("http://localhost:8081/api/orders");
      orders.value = response.orders;
      return response.orders;
    } catch (err: any) {
      console.error("Error fetching all orders:", err);
      error.value = err.data?.message || "Có lỗi xảy ra khi tải danh sách đơn hàng.";
      return null;
    } finally {
      loading.value = false;
    }
  };

  const updateOrderStatus = async (orderId: number, status: string) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`http://localhost:8081/api/orders/update-status/${orderId}`, {
        method: "PUT",
        body: { status },
      });
    } catch (err: any) {
      console.error("Error updating order status:", err);
      error.value = err.data?.message || "Có lỗi xảy ra khi cập nhật trạng thái đơn hàng.";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    orders,
    loading,
    error,
    fetchUserOrders,
    fetchAllOrders,
    updateOrderStatus,
    cancelOrder,
  };
};
