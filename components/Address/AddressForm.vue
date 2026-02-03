<template>
  <div 
    v-if="isOpen" 
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
    @click.self="handleClose"
  >
    <div class="bg-white rounded-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto">
      <!-- Header -->
      <div class="sticky top-0 bg-white border-b px-6 py-4 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">
          {{ isEditMode ? 'Chỉnh sửa địa chỉ' : ' Thêm địa chỉ mới' }}
        </h2>
        <button
          @click="handleClose"
          class="text-gray-500 hover:text-gray-700"
        >
          <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/>
          </svg>
        </button>
      </div>

      <!-- Form Content -->
      <form @submit.prevent="handleSubmit" class="p-6 space-y-6">
        
        <!-- Contact Name -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">
            Họ và tên người nhận <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.contact_name"
            type="text"
            required
            placeholder="VD: Nguyễn Văn A"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Phone -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">
            Số điện thoại <span class="text-red-500">*</span>
          </label>
          <input
            v-model="formData.phone"
            type="tel"
            required
            pattern="[0-9]{10,11}"
            placeholder="0912345678"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            :class="{ 'border-red-500': phoneError }"
          />
          <p v-if="phoneError" class="text-red-500 text-sm mt-1">{{ phoneError }}</p>
        </div>

        <!-- Address Type -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">
            Loại địa chỉ
          </label>
          <div class="grid grid-cols-3 gap-3">
            <button
              v-for="type in addressTypes"
              :key="type"
              type="button"
              @click="formData.address_type = type"
              class="px-4 py-2 border rounded-md transition-colors"
              :class="formData.address_type === type 
                ? 'border-blue-500 bg-blue-50 text-blue-700 font-medium' 
                : 'border-gray-300 hover:border-gray-400'"
            >
              {{ getAddressTypeIcon(type) }} {{ type }}
            </button>
          </div>
        </div>

        <!-- Detail Address -->
        <div>
          <label class="block text-gray-700 font-medium mb-2">
            Địa chỉ chi tiết <span class="text-red-500">*</span>
          </label>
          <textarea
            v-model="formData.detail_address"
            required
            rows="3"
            placeholder="VD: 123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM"
            class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <!-- Map Picker -->
        <MapPicker
          :initial-lat="formData.latitude"
          :initial-lng="formData.longitude"
          @update:position="handlePositionUpdate"
        />

        <!-- Is Default -->
        <div class="flex items-center gap-3">
          <input
            v-model="formData.is_default"
            type="checkbox"
            id="is-default"
            class="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
          />
          <label for="is-default" class="text-gray-700 font-medium cursor-pointer">
             Đặt làm địa chỉ mặc định
          </label>
        </div>

        <!-- Error Message -->
        <div
          v-if="errorMessage"
          class="p-3 bg-red-100 text-red-700 rounded-md"
        >
          {{ errorMessage }}
        </div>

        <!-- Actions -->
        <div class="flex gap-3 pt-4 border-t">
          <button
            type="button"
            @click="handleClose"
            class="flex-1 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
          >
            Hủy
          </button>
          <button
            type="submit"
            :disabled="isSubmitting"
            class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ isSubmitting ? ' Đang lưu...' : (isEditMode ? ' Cập nhật' : ' Thêm mới') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Address, AddressFormData } from '@/@type/address';
import { ADDRESS_TYPES } from '@/@type/address';
import MapPicker from './MapPicker.vue';

// Props & Emits
interface Props {
  isOpen: boolean;
  editingAddress?: Address | null;
}

const props = withDefaults(defineProps<Props>(), {
  editingAddress: null,
});

const emit = defineEmits<{
  (e: 'close'): void;
  (e: 'submit', data: AddressFormData): void;
}>();

// State
const isSubmitting = ref(false);
const errorMessage = ref('');
const phoneError = ref('');

const addressTypes = ADDRESS_TYPES;

const formData = ref<AddressFormData>({
  contact_name: '',
  phone: '',
  address_type: 'Nhà riêng',
  detail_address: '',
  latitude: null,
  longitude: null,
  is_default: false,
});

// Computed
const isEditMode = computed(() => !!props.editingAddress);

// Watch for editing address changes
watch(
  () => props.editingAddress,
  (newAddress) => {
    if (newAddress) {
      formData.value = {
        contact_name: newAddress.contact_name,
        phone: newAddress.phone,
        address_type: newAddress.address_type,
        detail_address: newAddress.detail_address,
        latitude: newAddress.latitude,
        longitude: newAddress.longitude,
        is_default: newAddress.is_default,
      };
    }
  },
  { immediate: true }
);

// Methods
const validatePhone = () => {
  const phone = formData.value.phone;
  if (!phone) {
    phoneError.value = '';
    return true;
  }

  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone.trim())) {
    phoneError.value = 'Số điện thoại phải có 10-11 chữ số';
    return false;
  }

  phoneError.value = '';
  return true;
};

const handlePositionUpdate = (position: { lat: number; lng: number } | null) => {
  if (position) {
    formData.value.latitude = position.lat;
    formData.value.longitude = position.lng;
  } else {
    formData.value.latitude = null;
    formData.value.longitude = null;
  }
};

const handleSubmit = async () => {
  // Validate
  if (!validatePhone()) {
    return;
  }

  // Check required fields
  if (!formData.value.contact_name.trim() || 
      !formData.value.phone.trim() || 
      !formData.value.detail_address.trim()) {
    errorMessage.value = 'Vui lòng điền đầy đủ thông tin bắt buộc';
    return;
  }

  isSubmitting.value = true;
  errorMessage.value = '';

  try {
    // Clean data
    const cleanData: AddressFormData = {
      contact_name: formData.value.contact_name.trim(),
      phone: formData.value.phone.trim(),
      address_type: formData.value.address_type,
      detail_address: formData.value.detail_address.trim(),
      latitude: formData.value.latitude,
      longitude: formData.value.longitude,
      is_default: formData.value.is_default,
    };

    emit('submit', cleanData);
  } catch (error: any) {
    errorMessage.value = error.message || 'Đã xảy ra lỗi';
  } finally {
    isSubmitting.value = false;
  }
};

const handleClose = () => {
  // Reset form
  formData.value = {
    contact_name: '',
    phone: '',
    address_type: 'Nhà riêng',
    detail_address: '',
    latitude: null,
    longitude: null,
    is_default: false,
  };
  errorMessage.value = '';
  phoneError.value = '';
  
  emit('close');
};

const getAddressTypeIcon = (type: string) => {
  const icons: Record<string, string> = {
    'Nhà riêng': '',
    'Văn phòng': '',
    'Khác': '',
  };
  return icons[type] || '';
};
</script>

<style scoped>
/* Smooth scroll for modal */
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: #cbd5e0 #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 8px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f7fafc;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: #cbd5e0;
  border-radius: 4px;
}
</style>