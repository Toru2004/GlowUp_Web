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
  onCreateOrder?: () => Promise<number | null>; // ✅ Function tạo order
  creatingOrder?: boolean;
}>();

const { createPayment, loading, error } = useVnpay();

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);

const handleCheckout = async () => {
  if (loading.value || props.creatingOrder) {
    console.log('⏳ Already processing...');
    return;
  }

  try {
    // ✅ BƯỚC 1: Tạo order trước
    let orderId: number | null = null;

    if (props.onCreateOrder) {
      console.log('📝 Creating order...');
      orderId = await props.onCreateOrder();
      
      if (!orderId) {
        console.error('❌ Failed to create order');
        return;
      }
    } else {
      // Fallback nếu không có function tạo order
      console.warn('⚠️ No onCreateOrder function provided, using test orderId');
      orderId = 3;
    }

    console.log('✅ Using orderId:', orderId);

    // ✅ BƯỚC 2: Tạo payment với orderId vừa tạo
    await createPayment({
      orderId: orderId,
      bankCode: undefined,
    });

  } catch (e: any) {
    console.error('❌ Checkout failed:', e);
  }
};

const isProcessing = computed(() => loading.value || props.creatingOrder);
</script>

<template>
  <div class="sticky top-4">
    <div class="bg-white rounded-2xl shadow-xl p-6 border border-gray-100">
      <!-- Summary details -->
      <div class="space-y-4 mb-6">
        <div class="flex justify-between text-gray-600">
          <span>Tạm tính ({{ totalQuantity }} sản phẩm)</span>
          <span class="font-semibold">{{ formatPrice(totalPrice) }}</span>
        </div>
        <div class="flex justify-between text-gray-600">
          <span>Phí vận chuyển</span>
          <span class="font-semibold">Miễn phí</span>
        </div>
        <div class="border-t border-gray-200 pt-4 flex justify-between text-lg font-bold">
          <span>Tổng cộng</span>
          <span class="text-glow-primary-600">{{ formatPrice(totalPrice) }}</span>
        </div>
      </div>

      <!-- Checkout button -->
      <button
        :disabled="isProcessing"
        @click="handleCheckout"
        class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl
               hover:bg-gray-800 transition-all transform hover:-translate-y-1
               shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
      >
        <span v-if="!isProcessing">
          Mua hàng ({{ totalQuantity }})
        </span>
        <span v-else-if="creatingOrder">
          Đang tạo đơn hàng...
        </span>
        <span v-else>
          Đang chuyển đến VNPay...
        </span>
      </button>

      <!-- Error message -->
      <div v-if="error" class="mt-4 p-4 bg-red-100 text-red-700 rounded-lg border border-red-200">
        <p class="font-semibold">❌ Lỗi:</p>
        <p class="text-sm mt-1">{{ error }}</p>
      </div>
    </div>
  </div>
</template>