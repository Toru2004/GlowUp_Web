<script setup lang="ts">
import { ShoppingBag } from "lucide-vue-next";
</script>

<template>
  <div class="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
    <ShoppingBag class="w-16 h-16 text-gray-300 mx-auto mb-4" />
    <p class="text-xl text-gray-500 font-medium mb-6">Giỏ hàng của bạn đang trống</p>
    <NuxtLink 
      to="/shop" 
      class="inline-flex items-center justify-center px-8 py-3 bg-glow-primary-600 text-white font-bold rounded-lg hover:bg-glow-primary-700 transition-all"
    >
      Tiếp tục mua sắm
    </NuxtLink>
  </div>
</template>
