<script setup lang="ts">
import { ref, computed, onMounted } from "vue";
import { ArrowLeft } from "lucide-vue-next";
import { useRoute } from "vue-router";
import { useCart } from "@/composables/useCart";
import ShippingAddress from "@/components/order/ShippingAddress.vue";
import PaymentMethod from "@/components/order/PaymentMethod.vue";
import OrderSummary from "@/components/order/OrderSummary.vue";
import VoucherSelector from "@/components/order/VoucherSelector.vue";

interface ContactInfo {
  fullName: string;
  phone: string;
  address: string;
}

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

const route = useRoute();
const { showNotification } = useNotification();
const { isAuthenticated, user } = useAuth();
const { cart } = useCart();
const IMAGE_BASE_URL = "http://localhost:8081/uploads/products";

// State
const selectedPaymentMethod = ref("COD");
const contactInfo = ref<ContactInfo>({
  fullName: "",
  phone: "",
  address: "",
});
const hasContactInfo = ref(false);
const selectedVoucher = ref<Voucher | null>(null);
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

const discount = computed(() => {
  if (!selectedVoucher.value) return 0;
  
  const voucher = selectedVoucher.value;
  if (voucher.discount_type === "percent") {
    const discountAmount = (subtotal.value * voucher.discount_value) / 100;
    return voucher.max_discount ? Math.min(discountAmount, voucher.max_discount) : discountAmount;
  } else {
    return voucher.discount_value;
  }
});

const total = computed(() => {
  return subtotal.value + shippingFee.value - discount.value;
});

// Check if contact info is valid
const isContactInfoValid = computed(() => {
  return contactInfo.value.fullName &&
         contactInfo.value.phone &&
         contactInfo.value.address;
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

  // TODO: Load user's saved contact info from API
  // For now, we'll check if user object has contact info
  if (user.value?.contactInfo) {
    contactInfo.value = { ...user.value.contactInfo };
    hasContactInfo.value = true;
  }
});

const handleEditContactInfo = () => {
  hasContactInfo.value = false;
};

const handlePlaceOrder = async () => {
  if (!isContactInfoValid.value) {
    showNotification("Lỗi", "Vui lòng điền đầy đủ thông tin liên hệ và địa chỉ giao hàng.", "error");
    return;
  }

  loading.value = true;
  try {
    // Prepare order data according to API specification
    const orderData = {
      userId: user.value?.userId,
      items: selectedItems.value.map((item: any) => ({
        productId: item.product_id,
        quantity: item.quantity,
        price: item.price,
      })),
      totalPrice: total.value,
      status: "pending",
      paymentMethod: selectedPaymentMethod.value,
      address: contactInfo.value.address,
      phone: contactInfo.value.phone,
      voucherId: selectedVoucher.value?.id || null,
    };

    console.log("Creating order:", orderData);
    
    // Call API to create order
    const response = await $fetch("http://localhost:8081/api/orders/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: orderData,
    });

    console.log("Order created successfully:", response);
    
    showNotification("Thành công", "Đặt hàng thành công! Cảm ơn bạn đã mua hàng.", "success");
    
    // Navigate to shop
    navigateTo("/shop");
  } catch (error: any) {
    console.error("Order error:", error);
    const errorMessage = error.data?.message || "Có lỗi xảy ra khi đặt hàng. Vui lòng thử lại.";
    showNotification("Lỗi", errorMessage, "error");
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
            :contactInfo="contactInfo"
            :hasContactInfo="hasContactInfo"
            @editContactInfo="handleEditContactInfo"
            @update:contactInfo="(val) => contactInfo = val"
          />

          <!-- Payment Method -->
          <PaymentMethod
            :selectedMethod="selectedPaymentMethod"
            @selectMethod="(method) => selectedPaymentMethod = method"
          />

          <!-- Voucher Selector -->
          <VoucherSelector
            :subtotal="subtotal"
            :selectedVoucher="selectedVoucher"
            @selectVoucher="(voucher) => selectedVoucher = voucher"
          />
        </div>

        <!-- Right Column - Order Summary -->
        <div class="lg:col-span-1">
          <OrderSummary
            :items="selectedItems"
            :imageBaseUrl="IMAGE_BASE_URL"
            :subtotal="subtotal"
            :shippingFee="shippingFee"
            :discount="discount"
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
