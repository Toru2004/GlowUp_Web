<script setup lang="ts">
import { MapPin, Edit2 } from "lucide-vue-next";

interface Address {
  fullName: string;
  phone: string;
  address: string;
}

const props = defineProps<{
  address: Address;
  hasAddress: boolean;
}>();

const emit = defineEmits<{
  editAddress: [];
  "update:address": [address: Address];
}>();
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <MapPin class="w-5 h-5 text-glow-primary-600" />
        <h2 class="text-lg font-bold text-gray-900">Địa chỉ giao hàng</h2>
      </div>
      <button 
        v-if="hasAddress"
        @click="emit('editAddress')"
        class="flex items-center gap-2 text-sm text-glow-primary-600 hover:text-glow-primary-700 font-medium transition-colors"
      >
        <Edit2 class="w-4 h-4" />
        Thay đổi
      </button>
    </div>

    <div v-if="hasAddress" class="space-y-2">
      <div class="flex items-start gap-3">
        <div class="flex-1">
          <p class="font-bold text-gray-900">{{ address.fullName }}</p>
          <p class="text-gray-600 text-sm">{{ address.phone }}</p>
        </div>
      </div>
      <p class="text-gray-700 leading-relaxed">
        {{ address.street }}, {{ address.ward }}, {{ address.district }}, {{ address.city }}
      </p>
    </div>

    <div v-else class="space-y-4">
      <p class="text-gray-500 text-sm mb-4">Bạn chưa có địa chỉ giao hàng. Vui lòng nhập thông tin bên dưới.</p>
      
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Họ và tên</label>
          <input 
            type="text"
            :value="address.fullName"
            @input="$emit('update:address', { ...address, fullName: ($event.target as HTMLInputElement).value })"
            placeholder="Nguyễn Văn A"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-glow-primary-200 focus:border-glow-primary-400 outline-none transition-all"
          />
        </div>
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Số điện thoại</label>
          <input 
            type="tel"
            :value="address.phone"
            @input="$emit('update:address', { ...address, phone: ($event.target as HTMLInputElement).value })"
            placeholder="0123456789"
            class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-glow-primary-200 focus:border-glow-primary-400 outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">Địa chỉ cụ thể</label>
        <input 
          type="text"
          :value="address.address"
          @input="$emit('update:address', { ...address, address: ($event.target as HTMLInputElement).value })"
          placeholder="Số nhà, tên đường"
          class="w-full px-4 py-2.5 border border-gray-200 rounded-xl focus:ring-2 focus:ring-glow-primary-200 focus:border-glow-primary-400 outline-none transition-all"
        />
      </div>
    </div>
  </div>
</template>
