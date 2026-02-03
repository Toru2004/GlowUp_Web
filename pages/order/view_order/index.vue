<script setup lang="ts">
import { onMounted, ref, computed } from "vue";
import { useOrder } from "@/composables/useOrder";
import { useAuth } from "@/composables/useAuth";
import BaseConfirmModal from "@/components/modal/BaseConfirmModal.vue";
import { 
  Package, 
  ChevronRight, 
  MapPin, 
  Phone, 
  Calendar, 
  CreditCard,
  ShoppingBag,
  X
} from "lucide-vue-next";

const { orders, loading, error, fetchUserOrders, cancelOrder } = useOrder();
const { user, isAuthenticated } = useAuth();
const { showNotification } = useNotification();

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
});

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("vi-VN", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "bg-yellow-100 text-yellow-700";
    case "confirmed":
      return "bg-blue-100 text-blue-700";
    case "shipping":
    case "shipped":
      return "bg-purple-100 text-purple-700";
    case "completed":
    case "delivered":
      return "bg-green-100 text-green-700";
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-700";
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending":
      return "Đang chờ xử lý";
    case "confirmed":
      return "Đã xác nhận";
    case "shipping":
    case "shipped":
      return "Đang giao hàng";
    case "completed":
    case "delivered":
      return "Đã giao hàng";
    case "cancelled":
      return "Đã hủy";
    default:
      return status;
  }
};

const getSubtotal = (items: any[]) => {
  return items.reduce((sum: number, item: any) => sum + (item.price * item.quantity), 0);
};

const calculateDiscount = (order: any) => {
  if (!order.voucher) return 0;
  
  if (order.voucher.discount_type === "fixed") {
    return order.voucher.discount_value;
  } else if (order.voucher.discount_type === "percent") {
    const subtotal = getSubtotal(order.items);
    return (subtotal * order.voucher.discount_value) / 100;
  }
  return 0;
};

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
    // Refresh the list
    if (user.value?.userId) {
      await fetchUserOrders(user.value.userId);
    }
  } catch (err: any) {
    showNotification("Lỗi", err.data?.message || "Không thể hủy đơn hàng.", "error");
  } finally {
    cancellingOrder.value = false;
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
      <div class="flex items-center gap-2 mb-8 bg-white p-1 rounded-2xl shadow-sm border border-gray-100 overflow-x-auto no-scrollbar">
        <button
          v-for="tab in statusTabs"
          :key="tab.value"
          @click="activeStatus = tab.value"
          :class="[
            'px-6 py-2.5 rounded-xl text-sm font-bold transition-all whitespace-nowrap',
            activeStatus === tab.value 
              ? 'bg-glow-primary-600 text-white shadow-md' 
              : 'text-gray-500 hover:bg-gray-50'
          ]"
        >
          {{ tab.label }}
        </button>
      </div>

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
        <div 
          v-for="order in filteredOrders" 
          :key="order.id"
          class="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow"
        >
          <!-- Order Header -->
          <div class="p-6 border-b border-gray-50 flex flex-wrap items-center justify-between gap-4">
            <div class="flex items-center gap-4">
              <div class="p-3 bg-glow-primary-50 text-glow-primary-600 rounded-xl">
                <Package class="w-6 h-6" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-gray-900">Mã đơn hàng: #{{ order.id }}</h3>
                <div class="flex items-center gap-2 text-sm text-gray-500 mt-1">
                  <Calendar class="w-4 h-4" />
                  {{ formatDate(order.created_at) }}
                </div>
              </div>
            </div>
            
            <span :class="['px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider', getStatusClass(order.status)]">
              {{ getStatusText(order.status) }}
            </span>
          </div>

          <!-- Order Content -->
          <div class="p-6">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <!-- Shipping Info -->
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Thông tin giao hàng</h4>
                <div class="space-y-3">
                  <div class="flex items-start gap-3">
                    <MapPin class="w-5 h-5 text-gray-400 mt-0.5" />
                    <p class="text-gray-700 text-sm leading-relaxed">{{ order.address }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <Phone class="w-5 h-5 text-gray-400" />
                    <p class="text-gray-700 text-sm">{{ order.phone }}</p>
                  </div>
                  <div class="flex items-center gap-3">
                    <CreditCard class="w-5 h-5 text-gray-400" />
                    <p class="text-gray-700 text-sm">{{ order.payment_method }}</p>
                  </div>
                </div>
              </div>

              <!-- Order Summary -->
              <div class="space-y-4">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Tóm tắt đơn hàng</h4>
                <div class="bg-gray-50 rounded-xl p-4 space-y-3">
                  <div class="flex justify-between text-sm">
                    <span class="text-gray-600">Thành tiền:</span>
                    <span class="text-gray-900 font-medium">{{ getSubtotal(order.items).toLocaleString() }}đ</span>
                  </div>
                  <div v-if="order.voucher" class="flex justify-between text-sm text-green-600">
                    <span>Mã giảm giá ({{ order.voucher.code }}):</span>
                    <span>- {{ calculateDiscount(order).toLocaleString() }}đ</span>
                  </div>
                  <div class="pt-3 border-t border-gray-200 flex justify-between items-center">
                    <span class="font-bold text-gray-900">Tổng cộng:</span>
                    <span class="text-xl font-bold text-glow-primary-600">{{ order.total_price.toLocaleString() }}đ</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Items List -->
            <div class="mt-8 pt-6 border-t border-gray-50">
              <div class="flex items-center justify-between mb-4">
                <h4 class="text-sm font-bold text-gray-400 uppercase tracking-widest">Chi tiết sản phẩm</h4>
              </div>
              <div class="space-y-3">
                <div 
                  v-for="item in order.items" 
                  :key="item.id"
                  class="flex items-center justify-between p-3 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors"
                >
                  <div class="flex items-center gap-3">
                    <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">
                      <ShoppingBag class="w-6 h-6" />
                    </div>
                    <div>
                      <p class="text-sm font-bold text-gray-900">Mã sản phẩm: #{{ item.product_id }}</p>
                      <p class="text-xs text-gray-500">Số lượng: {{ item.quantity }} x {{ item.price.toLocaleString() }}đ</p>
                    </div>
                  </div>
                  <p class="text-sm font-bold text-gray-900">{{ (item.price * item.quantity).toLocaleString() }}đ</p>
                </div>
              </div>
            </div>

            <!-- Order Actions -->
            <div 
              v-if="order.status.toLowerCase() === 'pending'" 
              class="mt-8 flex justify-end"
            >
              <button
                @click="handleCancelOrder(order.id)"
                class="px-6 py-2.5 rounded-xl text-sm font-bold text-red-600 bg-red-50 border border-red-100 hover:bg-red-100 hover:border-red-200 transition-all active:scale-95 flex items-center gap-2 shadow-sm"
              >
                <X class="w-4 h-4" />
                Hủy đơn hàng
              </button>
            </div>
          </div>
        </div>
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

.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
