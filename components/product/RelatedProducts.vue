<script setup lang="ts">
const props = defineProps<{
  products: any[];
  imageBaseUrl: string;
}>();

const getImageUrl = (imgName: string) => {
  if (!imgName) return "https://placehold.co/600x600?text=No+Image";
  return imgName.startsWith("http") ? imgName : `${props.imageBaseUrl}/${imgName}`;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
</script>

<template>
  <div class="mt-20">
    <h2 class="font-serif text-3xl text-gray-900 text-center mb-10">Sản Phẩm Tương Tự</h2>
    <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <NuxtLink
        v-for="item in products"
        :key="item.id"
        :to="`/shop/products/${item.id}`"
        class="group block"
      >
        <div class="aspect-[3/4] rounded-3xl overflow-hidden bg-gray-50 mb-4 relative shadow-sm group-hover:shadow-xl transition-all duration-500 border border-gray-100">
          <img 
            :src="getImageUrl(item.image)" 
            class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
            alt="Related product"
          />
          <div class="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/70 via-black/40 to-transparent translate-y-full group-hover:translate-y-0 transition-transform duration-300">
            <div class="w-full py-2.5 bg-white text-gray-900 rounded-xl font-bold text-sm text-center shadow-lg">
              Xem chi tiết
            </div>
          </div>
        </div>
        <div class="text-xs text-gray-500 uppercase tracking-wide mb-1.5 font-semibold">{{ item.brand }}</div>
        <div class="font-semibold text-gray-900 mb-1.5 line-clamp-1 group-hover:text-glow-primary-600 transition-colors">{{ item.name }}</div>
        <div class="font-bold text-glow-primary-600 text-lg">{{ formatPrice(item.price) }}</div>
      </NuxtLink>
    </div>
  </div>
</template>
