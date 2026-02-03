<template>
  <div class="flex gap-3 overflow-x-auto pb-2 mt-2">
    <div
      v-for="product in products"
      :key="product.id"
      class="min-w-[160px] bg-white rounded-xl shadow border p-2 text-xs"
    >
    

      <div class="mt-2 font-medium line-clamp-2">
        {{ product.name }}
      </div>

      <div class="text-blue-600 font-semibold mt-1">
        {{ formatPrice(product.price) }}₫
      </div>

      <div class="text-gray-400 text-[10px]">
        {{ product.brand }}
      </div>

      <NuxtLink
        :to="`/shop/products/${product.id}`"
        class="block mt-2 text-center text-white bg-blue-500 rounded-lg py-1 text-xs"
      >
        Xem chi tiết
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Product } from '@/composables/useChatbot';

defineProps<{
  products: Product[];
}>();



const formatPrice = (price: number) =>
  price.toLocaleString('vi-VN');
</script>
