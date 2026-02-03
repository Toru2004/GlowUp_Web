<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      
      <div class="mb-8">
        <h1 class="text-3xl font-bold text-gray-900">Thiết lập tài khoản</h1>
        <p class="mt-2 text-gray-600">Quản lý hồ sơ và địa chỉ giao hàng của bạn</p>
      </div>

      <div v-if="isPageLoading" class="flex flex-col items-center justify-center py-20">
        <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        <p class="mt-4 text-gray-500 font-medium">Đang tải dữ liệu...</p>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        <div class="lg:col-span-4 space-y-6">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div class="p-6 bg-gradient-to-r from-blue-600 to-blue-700">
              <div class="flex items-center gap-4">
                <div class="h-16 w-16 rounded-full bg-white/20 flex items-center justify-center text-white text-2xl font-bold backdrop-blur-sm border-2 border-white/30">
                  {{ getInitials(profileForm.full_name) }}
                </div>
                <div class="text-white">
                  <h2 class="text-xl font-bold truncate">{{ profileForm.full_name || 'User' }}</h2>
                  <p class="text-blue-100 text-sm truncate">{{ profileForm.email }}</p>
                </div>
              </div>
            </div>

            <div class="p-6">
              <h3 class="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <svg class="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"/></svg>
                Thông tin cá nhân
              </h3>

              <form @submit.prevent="handleUpdateProfile" class="space-y-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input 
                    v-model="profileForm.email" 
                    disabled
                    class="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-lg text-gray-500 cursor-not-allowed"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Họ và tên <span class="text-red-500">*</span></label>
                  <input 
                    v-model="profileForm.full_name" 
                    type="text" 
                    required
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  />
                </div>

                <div>
                  <label class="block text-sm font-medium text-gray-700 mb-1">Số điện thoại</label>
                  <input 
                    v-model="profileForm.phone" 
                    type="tel"
                    @input="validatePhone"
                    class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    :class="{ 'border-red-500 focus:ring-red-200': phoneError }"
                  />
                  <p v-if="phoneError" class="text-red-500 text-xs mt-1">{{ phoneError }}</p>
                </div>

                <div class="pt-2">
                  <button 
                    type="submit" 
                    :disabled="isProfileSubmitting || !!phoneError"
                    class="w-full flex justify-center items-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
                  >
                    <span v-if="isProfileSubmitting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white border-2 border-white border-t-transparent rounded-full"></span>
                    {{ isProfileSubmitting ? 'Đang lưu...' : 'Lưu thay đổi' }}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>

        <div class="lg:col-span-8">
          <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-6 min-h-[500px]">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl font-bold text-gray-800 flex items-center gap-2">
                <svg class="w-6 h-6 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
                Sổ địa chỉ
              </h3>
              <button
                @click="openCreateAddressForm"
                class="inline-flex items-center px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-600 hover:bg-blue-100 transition-colors text-sm font-medium"
              >
                <svg class="w-5 h-5 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"/></svg>
                Thêm địa chỉ mới
              </button>
            </div>

            <div v-if="addresses.length === 0" class="text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
              <div class="mx-auto h-24 w-24 text-gray-300 mb-4">
                 <svg fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"/></svg>
              </div>
              <h3 class="text-lg font-medium text-gray-900">Chưa có địa chỉ nào</h3>
              <p class="mt-1 text-gray-500">Hãy thêm địa chỉ để nhận hàng dễ dàng hơn.</p>
              <button 
                @click="openCreateAddressForm"
                class="mt-6 px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 shadow-sm"
              >
                Thêm địa chỉ ngay
              </button>
            </div>

            <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <AddressCard
                v-for="address in addresses"
                :key="address.id"
                :address="address"
                @edit="handleEditAddress"
                @delete="handleDeleteAddress"
                @setDefault="handleSetDefaultAddress"
              />
            </div>
          </div>
        </div>
      </div>

      <transition name="fade">
        <div v-if="toast.show" class="fixed bottom-6 right-6 px-6 py-4 rounded-lg shadow-xl z-50 flex items-center gap-3 transform transition-all duration-300" 
             :class="toast.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'">
          <span class="text-xl">
             <span v-if="toast.type === 'success'">✓</span>
             <span v-else>✕</span>
          </span>
          <p class="font-medium">{{ toast.message }}</p>
        </div>
      </transition>

      <AddressForm
        :is-open="showAddressForm"
        :editing-address="editingAddressData"
        @close="handleCloseAddressForm"
        @submit="handleAddressFormSubmit"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import type { User } from '@/@type/user'; // Đường dẫn type của bạn
import type { Address, AddressFormData } from '@/@type/address'; // Đường dẫn type của bạn
import AddressCard from '@/components/Address/AddressCard.vue';
import AddressForm from '@/components/Address/AddressForm.vue';
import { useAddress } from '@/composables/useAddress';
import { useApi } from '@/composables/useApi'; // Hoặc đường dẫn tới composable api của bạn

/* ================= COMPOSABLES ================= */
const { getMe, updateProfile } = useApi();
const { getAllAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress } = useAddress();

/* ================= STATE ================= */
const isPageLoading = ref(true);
const toast = ref({ show: false, message: '', type: 'success' as 'success' | 'error' });

// --- PROFILE STATE ---
const isProfileSubmitting = ref(false);
const phoneError = ref('');
const profileForm = ref<User>({
  id: 0,
  full_name: '',
  email: '',
  phone: null,
  role: '',
  created_at: '',
  status: ''
});

// --- ADDRESS STATE ---
const addresses = ref<Address[]>([]);
const showAddressForm = ref(false);
const editingAddressData = ref<Address | null>(null);

/* ================= LIFECYCLE ================= */
onMounted(async () => {
  try {
    // Gọi song song cả 2 API để tiết kiệm thời gian
    const [userData, addressList] = await Promise.all([
      getMe(),
      getAllAddresses()
    ]);

    // Set Data Profile
    if (userData) {
      profileForm.value = { ...userData };
    }

    // Set Data Address
    if (addressList) {
      addresses.value = addressList;
    }

  } catch (error) {
    console.error("Lỗi tải trang:", error);
    showToast('Có lỗi xảy ra khi tải dữ liệu.', 'error');
  } finally {
    isPageLoading.value = false;
  }
});

/* ================= LOGIC: PROFILE ================= */
const getInitials = (name: string) => {
  if (!name) return 'U';
  return name.charAt(0).toUpperCase();
};

const validatePhone = () => {
  const phone = profileForm.value.phone;
  if (!phone || phone.trim() === '') {
    phoneError.value = '';
    return true;
  }
  const phoneRegex = /^[0-9]{10,11}$/;
  if (!phoneRegex.test(phone.trim())) {
    phoneError.value = 'SĐT không hợp lệ (10-11 số)';
    return false;
  }
  phoneError.value = '';
  return true;
};

const handleUpdateProfile = async () => {
  if (!validatePhone()) return;
  
  isProfileSubmitting.value = true;
  try {
    const cleanData = {
      full_name: profileForm.value.full_name.trim(),
      phone: profileForm.value.phone?.trim() || null
    };
    
    await updateProfile(profileForm.value.id, cleanData);
    showToast('Cập nhật thông tin thành công!', 'success');
  } catch (error: any) {
    showToast(error.message || 'Lỗi cập nhật hồ sơ', 'error');
  } finally {
    isProfileSubmitting.value = false;
  }
};

/* ================= LOGIC: ADDRESS ================= */
const refreshAddresses = async () => {
  // Hàm này để reload nhẹ danh sách địa chỉ mà ko reload cả trang
  addresses.value = await getAllAddresses();
};

const openCreateAddressForm = () => {
  editingAddressData.value = null;
  showAddressForm.value = true;
};

const handleEditAddress = (id: number) => {
  const address = addresses.value.find((a) => a.id === id);
  if (address) {
    editingAddressData.value = address;
    showAddressForm.value = true;
  }
};

const handleCloseAddressForm = () => {
  showAddressForm.value = false;
  editingAddressData.value = null;
};

const handleAddressFormSubmit = async (data: AddressFormData) => {
  try {
    if (editingAddressData.value) {
      await updateAddress(editingAddressData.value.id, data);
      showToast('Cập nhật địa chỉ thành công', 'success');
    } else {
      await createAddress(data);
      showToast('Thêm địa chỉ mới thành công', 'success');
    }
    await refreshAddresses();
    handleCloseAddressForm();
  } catch (error: any) {
    showToast(error.message || 'Lỗi xử lý địa chỉ', 'error');
  }
};

const handleDeleteAddress = async (id: number) => {
  try {
    await deleteAddress(id);
    showToast('Đã xóa địa chỉ', 'success');
    await refreshAddresses();
  } catch (error: any) {
    showToast(error.message || 'Lỗi xóa địa chỉ', 'error');
  }
};

const handleSetDefaultAddress = async (id: number) => {
  try {
    await setDefaultAddress(id);
    showToast('Đã đặt làm địa chỉ mặc định', 'success');
    await refreshAddresses();
  } catch (error: any) {
    showToast(error.message || 'Lỗi đặt mặc định', 'error');
  }
};

/* ================= UTILS ================= */
const showToast = (message: string, type: 'success' | 'error') => {
  toast.value = { show: true, message, type };
  setTimeout(() => {
    toast.value.show = false;
  }, 3000);
};

</script>

<style scoped>
/* Hiệu ứng Fade cho Toast */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: translateY(20px);
}
</style>