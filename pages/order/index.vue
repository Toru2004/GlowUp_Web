<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ArrowLeft } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { useCart } from "@/composables/useCart";
import ShippingAddress from "@/components/order/ShippingAddress.vue";
import PaymentMethod from "@/components/order/PaymentMethod.vue";
import OrderSummary from "@/components/order/OrderSummary.vue";

interface Address {
  fullName: string;
  phone: string;
  address: string;
}

const route = useRoute();
const { showNotification } = useNotification();
const { isAuthenticated, user } = useAuth();
const { cart } = useCart();
const IMAGE_BASE_URL = "http://localhost:8081/uploads/products";

// State
const selectedPaymentMethod = ref("cod");
const shippingAddress = ref<Address>({
  fullName: "",
  phone: "",
  address: "",
});
const hasAddress = ref(false);
const loading = ref(false);

// Get selected items from cart based on query params
const selectedItemIds = computed(() => {
  const itemsParam = route.query.items as string;
  if (!itemsParam) return [];
  return itemsParam.split(",").map(id => parseInt(id));
});

const selectedItems = computed(() => {
  if (!cart.value || !cart.value.items) return [];
  return cart.value.items.filter((item: any) => 
    selectedItemIds.value.includes(item.id)
  );
});

const subtotal = computed(() => {
  return selectedItems.value.reduce((sum: number, item: any) => 
    sum + (item.price * item.quantity), 0
  );
});

const shippingFee = computed(() => {
  // Free shipping for orders over 500k
  return subtotal.value >= 500000 ? 0 : 30000;
});

const total = computed(() => {
  return subtotal.value + shippingFee.value;
});

// Check if address is valid
const isAddressValid = computed(() => {
  return shippingAddress.value.fullName &&
         shippingAddress.value.phone &&
         shippingAddress.value.address
});

onMounted(() => {
  if (!isAuthenticated.value) {
    navigateTo("/auth/login");
    return;
  }

  // Check if user has items selected
  if (selectedItemIds.value.length === 0) {
    showNotification("Thông báo", "Vui lòng chọn sản phẩm từ giỏ hàng.", "warning");
    navigateTo("/cart");
    return;
  }

  // TODO: Load user's saved address from API
  // For now, we'll check if user object has address
  if (user.value?.address) {
    shippingAddress.value = { ...user.value.address };
    hasAddress.value = true;
  }
});

const handleEditAddress = () => {
  hasAddress.value = false;
};

const handlePlaceOrder = async () => {
  if (!isAddressValid.value) {
    showNotification("Lỗi", "Vui lòng điền đầy đủ thông tin địa chỉ giao hàng.", "error");
    return;
  }

  loading.value = true;
  try {
    // TODO: Call API to create order
    const orderData = {
      items: selectedItems.value.map((item: any) => ({
        product_id: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      shipping_address: shippingAddress.value,
      payment_method: selectedPaymentMethod.value,
      subtotal: subtotal.value,
      shipping_fee: shippingFee.value,
      total: total.value,
    };

    console.log("Order data:", orderData);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    showNotification("Thành công", "Đặt hàng thành công! Cảm ơn bạn đã mua hàng.", "success");
    
    // Navigate to order success page or order history
    navigateTo("/shop");
  } catch (error) {
    console.error("Order error:", error);
    showNotification("Lỗi", "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.", "error");
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-6xl">
      <!-- Header -->
      <div class="flex items-center gap-4 mb-8">
        <NuxtLink to="/cart" class="text-gray-500 hover:text-glow-primary-600 transition-colors">
          <ArrowLeft class="w-6 h-6" />
        </NuxtLink>
        <h1 class="text-3xl font-serif font-bold text-gray-900">Đặt hàng</h1>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <!-- Left Column -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Shipping Address -->
          <ShippingAddress
            :address="shippingAddress"
            :hasAddress="hasAddress"
            @editAddress="handleEditAddress"
            @update:address="(val) => shippingAddress = val"
          />

          <!-- Payment Method -->
          <PaymentMethod
            :selectedMethod="selectedPaymentMethod"
            @selectMethod="(method) => selectedPaymentMethod = method"
          />
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <OrderSummary
            :items="selectedItems"
            :imageBaseUrl="IMAGE_BASE_URL"
            :subtotal="subtotal"
            :shippingFee="shippingFee"
            :total="total"
            @placeOrder="handlePlaceOrder"
          />
        </div>
      </div>

      <!-- Loading Overlay -->
      <div v-if="loading" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
        <div class="bg-white p-8 rounded-2xl shadow-xl">
          <div class="w-12 h-12 border-4 border-gray-200 border-t-glow-primary-600 rounded-full animate-spin mx-auto mb-4"></div>
          <p class="text-gray-700 font-medium">Đang xử lý đơn hàng...</p>
        </div>
      </div>
    </div>
  </div>
</template>
