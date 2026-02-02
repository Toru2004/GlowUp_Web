<script setup lang="ts">
import { ArrowLeft } from "lucide-vue-next";
import { useCart } from "@/composables/useCart";
import CartItem from "@/components/cart/CartItem.vue";
import CartSummary from "@/components/cart/CartSummary.vue";
import EmptyCart from "@/components/cart/EmptyCart.vue";

const { showNotification } = useNotification();
const { isAuthenticated } = useAuth();
const { cart, loading, fetchCart, removeItem, clearCart, updateQuantity } = useCart();
const IMAGE_BASE_URL = "http://localhost:8081/uploads/products";

onMounted(() => {
  if (!isAuthenticated.value) {
    navigateTo("/auth/login");
    return;
  }
  fetchCart();
});

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
</script>

<template>
  <div class="min-h-screen bg-white py-12">
    <div class="container mx-auto px-4 max-w-5xl">
      <!-- Header -->
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

      <!-- Loading -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="w-12 h-12 border-4 border-gray-200 border-t-glow-primary-600 rounded-full animate-spin"></div>
      </div>

      <!-- Empty Cart -->
      <EmptyCart v-else-if="!cart || cart.items.length === 0" />

      <!-- Cart Content -->
      <div v-else class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Cart Items -->
        <div class="lg:col-span-2 space-y-4">
          <CartItem
            v-for="item in cart.items"
            :key="item.id"
            :item="item"
            :imageBaseUrl="IMAGE_BASE_URL"
            @updateQuantity="handleUpdateQuantity"
            @removeItem="handleRemoveItem"
          />
        </div>

        <!-- Cart Summary -->
        <div class="lg:col-span-1">
          <CartSummary 
            :totalQuantity="cart.total_quantity"
            :totalPrice="cart.total_price"
          />
        </div>
      </div>
    </div>
  </div>
</template>
