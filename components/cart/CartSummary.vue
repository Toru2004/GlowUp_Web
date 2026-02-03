<!-- <script setup lang="ts">
const props = defineProps<{
  totalQuantity: number;
  totalPrice: number;
}>();

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
</script> -->
<script setup lang="ts">
import { useVnpay } from "@/composables/useVnpay";

const props = defineProps<{
  totalQuantity: number;
  totalPrice: number;
  orderId: number; // 👈 thêm orderId
}>();

const { createPayment, loading } = useVnpay();

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const handleCheckout = async () => {
  try {
    await createPayment({
      orderId: props.orderId,
      // bankCode: "NCB", // optional
    });
    // ⛔ không cần làm gì nữa vì đã redirect
  } catch (e) {
    console.error("Thanh toán thất bại", e);
  }
};
</script>


<template>
  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
    <h2 class="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Tóm tắt đơn hàng</h2>
    
    <div class="space-y-4 mb-6">
      <div class="flex justify-between text-gray-600">
        <span>Số lượng sản phẩm</span>
        <span class="font-medium text-gray-900">{{ totalQuantity }}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Tạm tính</span>
        <span class="font-medium text-gray-900">{{ formatPrice(totalPrice) }}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Phí vận chuyển</span>
        <span class="font-medium text-green-600">Miễn phí</span>
      </div>
    </div>

    <div class="pt-4 border-t border-gray-100 mb-8">
      <div class="flex justify-between items-end">
        <span class="text-lg font-bold text-gray-900">Tổng cộng</span>
        <span class="text-2xl font-bold text-glow-primary-600">{{ formatPrice(totalPrice) }}</span>
      </div>
    </div>

    <!-- <button class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg">
      Mua hàng ({{ totalQuantity }})
    </button> -->
    <button
  :disabled="loading"
  @click="handleCheckout"
  class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl
         hover:bg-gray-800 transition-all transform hover:-translate-y-1
         shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
>
  <span v-if="!loading">
    Mua hàng ({{ totalQuantity }})
  </span>
  <span v-else>
    Đang chuyển đến VNPay...
  </span>
</button>

  </div>
</template>
