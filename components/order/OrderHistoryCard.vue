<script setup lang="ts">
import { 
  Package, 
  MapPin, 
  Phone, 
  Calendar, 
  CreditCard,
  ShoppingBag,
  X
} from "lucide-vue-next";
import type { Order, OrderItem } from '@/@type/order';

const props = defineProps<{
  order: Order;
  paying?: boolean;
}>();

defineEmits<{
  (e: 'cancel', orderId: number): void;
  (e: 'pay', order: Order): void;
}>();

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "shipping":
    case "shipped":
      return "bg-purple-100 text-purple-700";
    case "completed":
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Đang chờ xử lý";
    case "confirmed":
      return "Đã xác nhận";
    case "shipping":
    case "shipped":
      return "Đang giao hàng";
    case "completed":
    case "delivered":
      return "Đã giao hàng";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const getSubtotal = (items: OrderItem[]) => {
  return items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
};

const calculateDiscount = (order: Order) => {
  if (!order.voucher) return 0;
  
  if (order.voucher.discount_type === "fixed") {
    return order.voucher.discount_value;
  } else if (order.voucher.discount_type === "percent") {
    const subtotal = getSubtotal(order.items);
    return (subtotal * order.voucher.discount_value) / 100;
  }
  return 0;
};

const getPaymentStatusText = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "Đã thanh toán";
    case "unpaid":
    default:
      return "Chưa thanh toán";
  }
};

const getPaymentStatusClass = (status: string) => {
  switch (status?.toLowerCase()) {
    case "paid":
      return "text-green-600 bg-green-50 px-2 py-0.5 rounded-lg";
    default:
      return "text-red-600 bg-red-50 px-2 py-0.5 rounded-lg";
  }
};

const getPaymentMethodText = (method: string) => {
  switch (method?.toLowerCase()) {
    case 'banking':
      return 'Chuyển khoản ngân hàng';
    case 'cod':
      return 'Thanh toán khi nhận hàng';
    default:
      return method;
  }
};
</script>

<template>
  <div class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
    <!-- Order Header -->
    <div class="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
      <div class="flex items-center gap-4">
        <div class="p-3 bg-glow-primary-50 text-glow-primary-600 rounded-xl">
          <Package class="w-6 h-6" />
        </div>
        <div>
          <h3 class="text-lg font-bold text-gray-900">Mã đơn hàng: #{{ order.id }}</h3>
          <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
            <Calendar class="w-4 h-4" />
            {{ formatDate(order.created_at) }}
          </div>
        </div>
      </div>
      
      <span :class="['px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider', getStatusClass(order.status)]">
        {{ getStatusText(order.status) }}
      </span>
    </div>

    <!-- Order Content -->
    <div class="p-6">
      <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
        <!-- Shipping Info -->
        <div class="space-y-4">
          <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Thông tin giao hàng</h4>
          <div class="space-y-3">
            <div class="flex items-start gap-3">
              <MapPin class="w-5 h-5 text-gray-400 mt-0.5" />
              <p class="text-gray-700 text-sm leading-relaxed">{{ order.address }}</p>
            </div>
            <div class="flex items-center gap-3">
              <Phone class="w-5 h-5 text-gray-400" />
              <p class="text-gray-700 text-sm">{{ order.phone }}</p>
            </div>
            <div class="flex items-center gap-3">
              <CreditCard class="w-5 h-5 text-gray-400" />
              <div class="flex flex-col">
                <p class="text-gray-700 text-sm font-medium">{{ getPaymentMethodText(order.payment_method) }}</p>
                <p v-if="order.payment_method?.toLowerCase() === 'banking'" class="text-xs mt-1 flex items-center gap-1 font-medium">
                  <span class="text-gray-500">Thanh toán:</span>
                  <span :class="getPaymentStatusClass(order.payment_status)">
                    {{ getPaymentStatusText(order.payment_status) }}
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>

        <!-- Order Summary -->
        <div class="space-y-4">
          <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Tóm tắt đơn hàng</h4>
          <div class="bg-gray-50 rounded-xl p-4 space-y-3">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Thành tiền:</span>
              <span class="text-gray-900 font-medium">{{ getSubtotal(order.items).toLocaleString() }}đ</span>
            </div>
            <div v-if="order.voucher" class="flex justify-between text-sm text-green-600">
              <span>Mã giảm giá ({{ order.voucher.code }}):</span>
              <span>- {{ calculateDiscount(order).toLocaleString() }}đ</span>
            </div>
            <div class="pt-3 border-t border-gray-200 flex justify-between items-center">
              <span class="font-bold text-gray-900">Tổng cộng:</span>
              <span class="text-xl font-bold text-glow-primary-600">{{ order.total_price.toLocaleString() }}đ</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Items List -->
      <div class="mt-8 pt-6 border-t border-gray-50">
        <div class="flex items-center justify-between mb-4">
          <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Chi tiết sản phẩm</h4>
        </div>
        <div class="space-y-3">
          <div 
            v-for="item in order.items" 
            :key="item.id"
            class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
          >
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                <ShoppingBag class="w-6 h-6" />
              </div>
              <div>
                <p class="text-sm font-bold text-gray-900">Mã sản phẩm: #{{ item.product_id }}</p>
                <p class="text-xs text-gray-500">Số lượng: {{ item.quantity }} x {{ item.price.toLocaleString() }}đ</p>
              </div>
            </div>
            <p class="text-sm font-bold text-gray-900">{{ (item.price * item.quantity).toLocaleString() }}đ</p>
          </div>
        </div>
      </div>

      <!-- Order Actions -->
      <div class="mt-8 flex justify-end gap-3">
        <button
          v-if="order.status.toLowerCase() === 'pending'"
          @click="$emit('cancel', order.id)"
          class="px-6 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
        >
          <X class="w-4 h-4" />
          Hủy đơn hàng
        </button>

        <button
          v-if="order.payment_method?.toLowerCase() === 'banking' && order.payment_status?.toLowerCase() !== 'paid' && order.status.toLowerCase() !== 'cancelled'"
          @click="$emit('pay', order)"
          :disabled="paying"
          class="px-6 py-2.5 rounded-xl text-sm font-bold text-white bg-glow-primary-600 hover:bg-glow-primary-700 transition-all active:scale-95 flex items-center gap-2 shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <CreditCard class="w-4 h-4" />
          {{ paying ? 'Đang xử lý...' : 'Thanh toán ngay' }}
        </button>
      </div>
    </div>
  </div>
</template>
