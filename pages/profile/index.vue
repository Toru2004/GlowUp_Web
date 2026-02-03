<template>
  <div class="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md mt-10">
    <h1 class="text-2xl font-bold mb-6 text-gray-800">Hồ sơ cá nhân</h1>

    <div v-if="isLoading" class="text-center py-4">
      <div class="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      <p class="mt-2">Đang tải dữ liệu...</p>
    </div>

    <form v-else @submit.prevent="handleUpdate">
      
      <!-- Email (Read-only) -->
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Email</label>
        <input 
          v-model="formData.email" 
          disabled
          class="w-full px-4 py-2 border bg-gray-100 rounded-md cursor-not-allowed"
        />
      </div>

      <!-- Họ tên -->
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">
          Họ và tên <span class="text-red-500">*</span>
        </label>
        <input 
          v-model="formData.full_name" 
          type="text" 
          required
          minlength="2"
          maxlength="100"
          placeholder="Nguyễn Văn A"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      <!-- Số điện thoại -->
      <div class="mb-4">
        <label class="block text-gray-700 font-medium mb-2">Số điện thoại</label>
        <input 
          v-model="formData.phone" 
          type="tel"
          pattern="[0-9]{10,11}"
          placeholder="0912345678"
          @input="validatePhone"
          class="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          :class="{ 'border-red-500': phoneError }"
        />
        <p v-if="phoneError" class="text-red-500 text-sm mt-1">{{ phoneError }}</p>
      </div>

      <!-- Submit Button -->
      <button 
        type="submit" 
        :disabled="isSubmitting || !!phoneError"
        class="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {{ isSubmitting ? 'Đang lưu...' : 'Cập nhật thông tin' }}
      </button>

      <!-- Message -->
      <div 
        v-if="message" 
        :class="`mt-4 p-3 rounded-md text-center ${isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`"
      >
        {{ message }}
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/@type/user';

// Composables
const { getMe, updateProfile } = useApi();

// State
const isLoading = ref(true);
const isSubmitting = ref(false);
const message = ref('');
const isError = ref(false);
const phoneError = ref('');

// Form Data
const formData = ref<User>({
    id: 0,
    full_name: '',
    email: '',
    phone: null,
    role: '',
    status: '',
    created_at: ''
});

// Validation
const validatePhone = () => {
    const phone = formData.value.phone;
    
    if (!phone || phone.trim() === '') {
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

// Fetch Data
onMounted(async () => {
    try {
        const data = await getMe();
        if (data) {
            formData.value = { ...data };
        }
    } catch (error: any) {
        console.error('Fetch user error:', error);
        message.value = "Không thể tải thông tin người dùng";
        isError.value = true;
    } finally {
        isLoading.value = false;
    }
});

// Handle Update
const handleUpdate = async () => {
    // Validate
    if (!validatePhone()) {
        return;
    }
    
    isSubmitting.value = true;
    message.value = '';
    isError.value = false;

    try {
        // Clean data
        const cleanData = {
            full_name: formData.value.full_name.trim(),
            phone: formData.value.phone?.trim() || null
        };

        // API call
        await updateProfile(formData.value.id, cleanData);

        message.value = " Cập nhật thành công!";
    
        // Auto clear success message
        setTimeout(() => {
            message.value = '';
        }, 3000);

    } catch (error: any) {
        console.error('Update profile error:', error);
        isError.value = true;
        
        // Handle error message
        if (error.response?.data?.message) {
            message.value = error.response.data.message;
        } else if (error.message) {
            message.value = error.message;
        } else {
            message.value = " Đã xảy ra lỗi khi cập nhật";
        }
        
        // Auto clear error after 5s
        setTimeout(() => {
            message.value = '';
            isError.value = false;
        }, 5000);
    } finally {
        isSubmitting.value = false;
    }
};
</script>