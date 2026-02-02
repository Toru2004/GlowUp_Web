<script setup lang="ts">
import { Trash2, Minus, Plus } from "lucide-vue-next";

const props = defineProps<{
  item: any;
  imageBaseUrl: string;
}>();

const emit = defineEmits<{
  updateQuantity: [itemId: number, quantity: number];
  removeItem: [itemId: number];
}>();

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const getImageUrl = (imgName: string) => {
  if (!imgName) return "https://placehold.co/100x100?text=No+Image";
  return imgName.startsWith("http") ? imgName : `${props.imageBaseUrl}/${imgName}`;
};

const handleInputQuantity = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let val = parseInt(target.value);
  
  if (isNaN(val) || val < 1) {
    if (target.value !== "") {
      emit("updateQuantity", props.item.id, 1);
    }
  } else {
    emit("updateQuantity", props.item.id, val);
  }
};

const handleBlurQuantity = (event: Event) => {
  const target = event.target as HTMLInputElement;
  let val = parseInt(target.value);
  if (isNaN(val) || val < 1) {
    emit("updateQuantity", props.item.id, 1);
  }
};
</script>

<template>
  <div class="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
    <div class="w-24 h-24 flex-shrink-0 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
      <img :src="getImageUrl(item.images[0])" :alt="item.name" class="w-full h-full object-cover" />
    </div>

    <div class="flex-grow text-center sm:text-left">
      <p class="text-xs font-bold text-glow-primary-500 uppercase tracking-wider mb-1">{{ item.brand }}</p>
      <h3 class="text-lg font-bold text-gray-900 mb-1 line-clamp-1">{{ item.name }}</h3>
      <p class="text-glow-primary-600 font-bold">{{ formatPrice(item.price) }}</p>
    </div>

    <div class="flex items-center gap-4">
      <div class="flex items-center border border-gray-200 rounded-lg overflow-hidden">
        <button 
          @click="emit('updateQuantity', item.id, item.quantity - 1)"
          :disabled="item.quantity <= 1"
          :class="[
            'w-10 h-10 flex items-center justify-center transition-colors border-r border-gray-200',
            item.quantity <= 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'hover:bg-gray-50 text-gray-900'
          ]"
        >
          <Minus class="w-4 h-4" />
        </button>
        <input 
          type="number" 
          :value="item.quantity"
          @change="handleInputQuantity"
          @blur="handleBlurQuantity"
          min="1"
          class="w-12 text-center font-bold bg-transparent border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
        />
        <button 
          @click="emit('updateQuantity', item.id, item.quantity + 1)"
          class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-900 transition-colors border-l border-gray-200"
        >
          <Plus class="w-4 h-4" />
        </button>
      </div>
      <button 
        @click="emit('removeItem', item.id)"
        class="p-2 text-gray-400 hover:text-red-500 transition-colors"
      >
        <Trash2 class="w-5 h-5" />
      </button>
    </div>
  </div>
</template>
