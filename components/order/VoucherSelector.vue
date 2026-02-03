<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { Tag, X } from "lucide-vue-next";

interface Voucher {
  id: number;
  code: string;
  discount_type: "percent" | "fixed";
  discount_value: number;
  min_order_value: number;
  max_discount: number | null;
  quantity: number;
  start_date: string;
  end_date: string;
  status: string;
}

const props = defineProps<{
  subtotal: number;
  selectedVoucher: Voucher | null;
}>();

const emit = defineEmits<{
  selectVoucher: [voucher: Voucher | null];
}>();

const vouchers = ref<Voucher[]>([]);
const loading = ref(false);
const showVoucherList = ref(false);

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);

const fetchVouchers = async () => {
  loading.value = true;
  try {
    const response = await $fetch<Voucher[]>("http://localhost:8081/api/vouchers");
    vouchers.value = response.filter((v: Voucher) => v.status === "active");
  } catch (error) {
    console.error("Error fetching vouchers:", error);
  } finally {
    loading.value = false;
  }
};

const canUseVoucher = (voucher: Voucher) => {
  return props.subtotal >= voucher.min_order_value;
};

const calculateDiscount = (voucher: Voucher) => {
  if (voucher.discount_type === "percent") {
    const discount = (props.subtotal * voucher.discount_value) / 100;
    return voucher.max_discount ? Math.min(discount, voucher.max_discount) : discount;
  } else {
    return voucher.discount_value;
  }
};

const handleSelectVoucher = (voucher: Voucher) => {
  if (!canUseVoucher(voucher)) return;
  emit("selectVoucher", voucher);
  showVoucherList.value = false;
};

const handleRemoveVoucher = () => {
  emit("selectVoucher", null);
};

onMounted(() => {
  fetchVouchers();
});
</script>

<template>
  <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
    <div class="flex items-center justify-between mb-4">
      <div class="flex items-center gap-2">
        <Tag class="w-5 h-5 text-glow-primary-600" />
        <h2 class="text-lg font-bold text-gray-900">Mã giảm giá</h2>
      </div>
    </div>

    <!-- Selected Voucher -->
    <div v-if="selectedVoucher" class="mb-4">
      <div class="flex items-center justify-between p-4 bg-gradient-to-r from-glow-primary-50 to-pink-50 border-2 border-glow-primary-500 rounded-xl">
        <div class="flex-1">
          <p class="font-bold text-glow-primary-700 text-lg">{{ selectedVoucher.code }}</p>
          <p class="text-sm text-gray-600">
            Giảm {{ selectedVoucher.discount_type === 'percent' 
              ? `${selectedVoucher.discount_value}%` 
              : formatPrice(selectedVoucher.discount_value) }}
          </p>
        </div>
        <button 
          @click="handleRemoveVoucher"
          class="p-2 hover:bg-white rounded-lg transition-colors"
        >
          <X class="w-5 h-5 text-gray-500" />
        </button>
      </div>
    </div>

    <!-- Select Voucher Button -->
    <button
      v-else
      @click="showVoucherList = !showVoucherList"
      class="w-full py-3 border-2 border-dashed border-gray-300 rounded-xl text-gray-600 hover:border-glow-primary-400 hover:text-glow-primary-600 transition-all font-medium"
    >
      {{ showVoucherList ? 'Đóng danh sách' : 'Chọn mã giảm giá' }}
    </button>

    <!-- Voucher List -->
    <div v-if="showVoucherList && !selectedVoucher" class="mt-4 space-y-3 max-h-64 overflow-y-auto">
      <div v-if="loading" class="text-center py-8">
        <div class="w-8 h-8 border-4 border-gray-200 border-t-glow-primary-600 rounded-full animate-spin mx-auto"></div>
      </div>
      
      <div v-else-if="vouchers.length === 0" class="text-center py-8 text-gray-500">
        Không có mã giảm giá khả dụng
      </div>

      <div
        v-else
        v-for="voucher in vouchers"
        :key="voucher.id"
        @click="handleSelectVoucher(voucher)"
        :class="[
          'p-4 border-2 rounded-xl transition-all cursor-pointer',
          canUseVoucher(voucher)
            ? 'border-gray-200 hover:border-glow-primary-400 hover:bg-glow-primary-50'
            : 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
        ]"
      >
        <div class="flex items-start justify-between">
          <div class="flex-1">
            <p class="font-bold text-gray-900">{{ voucher.code }}</p>
            <p class="text-sm text-gray-600 mt-1">
              Giảm {{ voucher.discount_type === 'percent' 
                ? `${voucher.discount_value}%` 
                : formatPrice(voucher.discount_value) }}
              {{ voucher.max_discount && voucher.discount_type === 'percent' 
                ? `(Tối đa ${formatPrice(voucher.max_discount)})` 
                : '' }}
            </p>
            <p class="text-xs text-gray-500 mt-1">
              Đơn tối thiểu: {{ formatPrice(voucher.min_order_value) }}
            </p>
          </div>
          <div v-if="canUseVoucher(voucher)" class="text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded">
            Áp dụng
          </div>
          <div v-else class="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-1 rounded">
            Không đủ điều kiện
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
