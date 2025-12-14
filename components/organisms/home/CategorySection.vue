<script setup lang="ts">
import { ArrowRight } from 'lucide-vue-next';
</script>

<template>
  <section class="py-20 bg-white">
    <div class="container mx-auto px-4 md:px-6">
      <div class="text-center max-w-2xl mx-auto mb-16">
        <h2 class="text-3xl font-serif font-bold text-gray-900 mb-4">Mua Sắm Theo Danh Mục</h2>
        <p class="text-gray-500">Khám phá các dòng sản phẩm đa dạng phù hợp với mọi loại da và sở thích làm đẹp.</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div v-for="i in 3" :key="i" class="group relative overflow-hidden rounded-2xl aspect-[4/5] bg-gray-100 cursor-pointer">
            <div class="absolute inset-0 bg-gray-200 flex items-center justify-center text-gray-400 group-hover:scale-105 transition-transform duration-500">
              <span class="text-4xl">🧴</span>
            </div>
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-8 text-white">
              <h3 class="text-2xl font-serif font-bold mb-2">Chăm Sóc Da {{ i }}</h3>
              <span class="text-sm font-medium opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 flex items-center gap-2">
                Xem Bộ Sưu Tập <ArrowRight class="w-4 h-4" />
              </span>
            </div>
        </div>
      </div>
    </div>
  </section>
</template>
