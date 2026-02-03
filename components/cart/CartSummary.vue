<script setup lang="ts">
const props = defineProps<{
  totalQuantity: number;
  totalPrice: number;
  selectedCount: number;
  hasSelection: boolean;
}>();

const emit = defineEmits<{
  checkout: [];
}>();

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
    <h2 class="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Tóm tắt đơn hàng</h2>
    
    <div class="space-y-4 mb-6">
      <div class="flex justify-between text-gray-600">
        <span>Sản phẩm đã chọn</span>
        <span class="font-medium text-gray-900">{{ selectedCount }}</span>
      </div>
      <div class="flex justify-between text-gray-600">
        <span>Tổng số lượng</span>
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

    <button 
      @click="emit('checkout')"
      :disabled="!hasSelection"
      :class="[
        'w-full py-4 font-bold rounded-xl transition-all shadow-lg',
        hasSelection
          ? 'bg-gray-900 text-white hover:bg-gray-800 transform hover:-translate-y-1 cursor-pointer'
          : 'bg-gray-300 text-gray-500 cursor-not-allowed'
      ]"
    >
      {{ hasSelection ? `Mua hàng (${totalQuantity})` : 'Chọn sản phẩm để mua' }}
    </button>
  </div>
</template>
    