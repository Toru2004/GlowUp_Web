<script setup lang="ts">
import { ShoppingBag, Trash2, Minus, Plus, ArrowLeft } from "lucide-vue-next";
import { useCart } from "@/composables/useCart";

const { showNotification } = useNotification();
const { user, isAuthenticated } = useAuth();
const { cart, loading, fetchCart, removeItem, clearCart, updateQuantity } = useCart();
const IMAGE_BASE_URL = "http://localhost:8081/uploads/products";

onMounted(() => {
  if (!isAuthenticated.value) {
    navigateTo("/auth/login");
    return;
  }
  fetchCart();
});

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );

const handleRemoveItem = async (itemId: number) => {
  if (confirm("Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?")) {
    try {
      await removeItem(itemId);
      showNotification("Thành công", "Đã xóa sản phẩm khỏi giỏ hàng.", "success");
    } catch (error) {
      showNotification("Lỗi", "Không thể xóa sản phẩm. Vui lòng thử lại.", "error");
    }
  }
};

const handleClearCart = async () => {
  if (confirm("Bạn có chắc chắn muốn xóa toàn bộ sản phẩm trong giỏ hàng?")) {
    try {
      await clearCart();
      showNotification("Thành công", "Đã làm trống giỏ hàng.", "success");
    } catch (error) {
      showNotification("Lỗi", "Không thể làm trống giỏ hàng. Vui lòng thử lại.", "error");
    }
  }
};

const handleUpdateQuantity = async (itemId: number, newQuantity: number) => {
  if (newQuantity < 1) return;
  try {
    await updateQuantity(itemId, newQuantity);
  } catch (error) {
    showNotification("Lỗi", "Không thể cập nhật số lượng. Vui lòng thử lại.", "error");
  }
};

const handleInputQuantity = (itemId: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  let val = parseInt(target.value);
  
  if (isNaN(val) || val < 1) {
    // We'll let them type, but on blur or if they press enter we fix it.
    // Or we can fix it immediately if it's explicitly 0 or negative.
    if (target.value !== "") {
       handleUpdateQuantity(itemId, 1);
    }
  } else {
    handleUpdateQuantity(itemId, val);
  }
};

const handleBlurQuantity = (itemId: number, event: Event) => {
  const target = event.target as HTMLInputElement;
  let val = parseInt(target.value);
  if (isNaN(val) || val < 1) {
    handleUpdateQuantity(itemId, 1);
  }
};

const getImageUrl = (imgName: string) => {
  if (!imgName) return "https://placehold.co/100x100?text=No+Image";
  return imgName.startsWith("http") ? imgName : `${IMAGE_BASE_URL}/${imgName}`;
};
</script>

<template>
  <div class="cart-page py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      <div class="flex items-center justify-between gap-4 mb-8">
        <div class="flex items-center gap-4">
          <NuxtLink to="/shop" class="text-gray-500 hover:text-glow-primary-600 transition-colors">
            <ArrowLeft class="w-6 h-6" />
          </NuxtLink>
          <h1 class="text-3xl font-serif font-bold text-gray-900">Giỏ hàng của bạn</h1>
        </div>
        <button 
          v-if="cart && cart.items.length > 0"
          @click="handleClearCart"
          class="text-sm font-medium text-red-500 hover:text-red-700 transition-colors"
        >
          Xóa tất cả
        </button>
      </div>

      <div v-if="loading" class="flex justify-center py-20">
        <div class="spinner"></div>
      </div>

      <div v-else-if="!cart || cart.items.length === 0" class="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
        <ShoppingBag class="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <p class="text-xl text-gray-500 font-medium mb-6">Giỏ hàng của bạn đang trống</p>
        <NuxtLink to="/shop" class="inline-flex items-center justify-center px-8 py-3 bg-glow-primary-600 text-white font-bold rounded-lg hover:bg-glow-primary-700 transition-all">
          Tiếp tục mua sắm
        </NuxtLink>
      </div>

      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- List Items -->
        <div class="lg:col-span-2 space-y-4">
          <div v-for="item in cart.items" :key="item.id" class="flex flex-col sm:flex-row items-center gap-6 p-4 bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
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
                  @click="handleUpdateQuantity(item.id, item.quantity - 1)"
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
                  @change="handleInputQuantity(item.id, $event)"
                  @blur="handleBlurQuantity(item.id, $event)"
                  min="1"
                  class="w-12 text-center font-bold bg-transparent border-none focus:ring-0 [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
                <button 
                  @click="handleUpdateQuantity(item.id, item.quantity + 1)"
                  class="w-10 h-10 flex items-center justify-center hover:bg-gray-50 text-gray-900 transition-colors border-l border-gray-200"
                >
                  <Plus class="w-4 h-4" />
                </button>
              </div>
              <button 
                @click="handleRemoveItem(item.id)"
                class="p-2 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 class="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        <!-- Summary -->
        <div class="lg:col-span-1">
          <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm sticky top-24">
            <h2 class="text-xl font-bold text-gray-900 mb-6 pb-4 border-b border-gray-50">Tóm tắt đơn hàng</h2>
            
            <div class="space-y-4 mb-6">
              <div class="flex justify-between text-gray-600">
                <span>Số lượng sản phẩm</span>
                <span class="font-medium text-gray-900">{{ cart.total_quantity }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Tạm tính</span>
                <span class="font-medium text-gray-900">{{ formatPrice(cart.total_price) }}</span>
              </div>
              <div class="flex justify-between text-gray-600">
                <span>Phí vận chuyển</span>
                <span class="font-medium text-green-600">Miễn phí</span>
              </div>
            </div>

            <div class="pt-4 border-t border-gray-100 mb-8">
              <div class="flex justify-between items-end">
                <span class="text-lg font-bold text-gray-900">Tổng cộng</span>
                <span class="text-2xl font-bold text-glow-primary-600">{{ formatPrice(cart.total_price) }}</span>
              </div>
            </div>

            <button class="w-full py-4 bg-gray-900 text-white font-bold rounded-xl hover:bg-gray-800 transition-all transform hover:-translate-y-1 shadow-lg">
              Mua hàng ({{ cart.total_quantity }})
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.spinner {
  width: 48px;
  height: 48px;
  border: 4px solid rgba(11, 111, 163, 0.1);
  border-radius: 50%;
  border-top-color: #0b6fa3;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
