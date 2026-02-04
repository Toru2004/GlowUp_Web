<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useRoute } from "vue-router";
import { useOrder } from "@/composables/useOrder";
import { useAuth } from "@/composables/useAuth";
import { useVnpay } from "@/composables/useVnpay";
import { useNotification } from "@/composables/useNotification";
import BaseConfirmModal from "@/components/modal/BaseConfirmModal.vue";
import OrderStatusTabs from "@/components/order/OrderStatusTabs.vue";
import OrderHistoryCard from "@/components/order/OrderHistoryCard.vue";
import { 
  Package, 
  ShoppingBag,
  X
} from "lucide-vue-next";

const { orders, loading, error, fetchUserOrders, cancelOrder } = useOrder();
const { user, isAuthenticated } = useAuth();
const { showNotification } = useNotification();
const { createPayment, loading: paying } = useVnpay();
const route = useRoute();

// Modal state
const showCancelModal = ref(false);
const orderToCancel = ref<number | null>(null);
const cancellingOrder = ref(false);

// Filter state
const activeStatus = ref("all");
const statusTabs = [
  { label: "Tất cả", value: "all" },
  { label: "Chờ xác nhận", value: "pending" },
  { label: "Đã xác nhận", value: "confirmed" },
  { label: "Đang giao hàng", value: "shipping" },
  { label: "Đã giao hàng", value: "completed" },
  { label: "Đã hủy", value: "cancelled" },
];

const filteredOrders = computed(() => {
  if (activeStatus.value === "all") return orders.value;
  return orders.value.filter(order => order.status.toLowerCase() === activeStatus.value.toLowerCase());
});

onMounted(async () => {
  if (!isAuthenticated.value) {
    navigateTo("/auth/login");
    return;
  }
  
  if (user.value?.userId) {
    await fetchUserOrders(user.value.userId);
  }

  // Check for payment status in URL
  if (route.query.payment_success === 'true') {
    showNotification("Thành công", "Thanh toán đơn hàng thành công!", "success");
    if (user.value?.userId) {
      await fetchUserOrders(user.value.userId);
    }
    window.history.replaceState({}, document.title, window.location.pathname);
  } else if (route.query.payment_failed === 'true') {
    const msg = route.query.message as string || "Thanh toán thất bại.";
    showNotification("Thất bại", msg, "error");
    window.history.replaceState({}, document.title, window.location.pathname);
  }
});

const handleCancelOrder = (orderId: number) => {
  orderToCancel.value = orderId;
  showCancelModal.value = true;
};

const confirmCancelOrder = async () => {
  if (!orderToCancel.value) return;

  cancellingOrder.value = true;
  try {
    await cancelOrder(orderToCancel.value);
    showNotification("Thành công", "Đã hủy đơn hàng thành công.", "success");
    showCancelModal.value = false;
    orderToCancel.value = null;
    if (user.value?.userId) {
      await fetchUserOrders(user.value.userId);
    }
  } catch (err: any) {
    showNotification("Lỗi", err.data?.message || "Không thể hủy đơn hàng.", "error");
  } finally {
    cancellingOrder.value = false;
  }
};

const handlePayNow = async (order: any) => {
  try {
    await createPayment({
      orderId: order.id,
    });
  } catch (err: any) {
    showNotification("Lỗi", err.message || "Không thể tiến hành thanh toán.", "error");
  }
};
</script>

<template>
  <div class="min-h-screen bg-gray-50 py-12">
    <div class="container mx-auto px-4 max-w-4xl">
      <div class="flex items-center justify-between mb-8">
        <h1 class="text-3xl font-serif font-bold text-gray-900">Đơn hàng của tôi</h1>
        <NuxtLink 
          to="/shop" 
          class="flex items-center gap-2 text-glow-primary-600 hover:text-glow-primary-700 font-medium transition-colors"
        >
          <ShoppingBag class="w-5 h-5" />
          Tiếp tục mua sắm
        </NuxtLink>
      </div>

      <!-- Status Tabs -->
      <OrderStatusTabs 
        v-model:activeStatus="activeStatus" 
        :statusTabs="statusTabs" 
      />

      <!-- Loading State -->
      <div v-if="loading" class="flex flex-col items-center justify-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
        <div class="w-12 h-12 border-4 border-gray-100 border-t-glow-primary-600 rounded-full animate-spin mb-4"></div>
        <p class="text-gray-500 font-medium">Đang tải danh sách đơn hàng...</p>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="p-8 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <div class="w-16 h-16 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
          <X class="w-8 h-8" />
        </div>
        <h3 class="text-xl font-bold text-gray-900 mb-2">Đã có lỗi xảy ra</h3>
        <p class="text-gray-600 mb-6">{{ error }}</p>
        <button 
          @click="user?.userId && fetchUserOrders(user.userId)"
          class="px-6 py-2 bg-glow-primary-600 text-white rounded-lg hover:bg-glow-primary-700 transition-colors"
        >
          Thử lại
        </button>
      </div>

      <!-- Empty State -->
      <div v-else-if="filteredOrders.length === 0" class="p-12 bg-white rounded-2xl shadow-sm border border-gray-100 text-center">
        <div class="w-20 h-20 bg-gray-50 text-gray-400 rounded-full flex items-center justify-center mx-auto mb-6">
          <Package class="w-10 h-10" />
        </div>
        <h3 class="text-2xl font-bold text-gray-900 mb-2">Không tìm thấy đơn hàng</h3>
        <p class="text-gray-600 mb-8 max-w-md mx-auto">
          {{ activeStatus === 'all' ? 'Bạn chưa thực hiện đơn hàng nào.' : 'Không có đơn hàng nào ở trạng thái này.' }}
        </p>
        <NuxtLink 
          v-if="activeStatus === 'all'"
          to="/shop"
          class="inline-flex items-center px-8 py-3 bg-glow-primary-600 text-white font-bold rounded-xl hover:bg-glow-primary-700 transition-all hover:shadow-lg active:scale-95"
        >
          Mua sắm ngay
        </NuxtLink>
        <button 
          v-else
          @click="activeStatus = 'all'"
          class="inline-flex items-center px-8 py-3 bg-gray-100 text-gray-900 font-bold rounded-xl hover:bg-gray-200 transition-all active:scale-95"
        >
          Xem tất cả đơn hàng
        </button>
      </div>

      <!-- Orders List -->
      <div v-else class="space-y-6">
        <OrderHistoryCard 
          v-for="order in filteredOrders" 
          :key="order.id"
          :order="order"
          :paying="paying"
          @cancel="handleCancelOrder"
          @pay="handlePayNow"
        />
      </div>

      <!-- Reusable Confirmation Modal -->
      <BaseConfirmModal
        :show="showCancelModal"
        title="Xác nhận hủy đơn hàng"
        message="Bạn có chắc chắn muốn hủy đơn hàng này không? Hành động này không thể hoàn tác."
        confirmText="Hủy đơn hàng"
        cancelText="Để tôi xem lại"
        type="danger"
        :loading="cancellingOrder"
        @confirm="confirmCancelOrder"
        @cancel="showCancelModal = false"
      />
    </div>
  </div>
</template>

<style scoped>
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
