<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useOrder } from "../../composables/useOrder";
import type { Order } from "../../@type/order";

definePageMeta({
  layout: "admin",
});

const { orders, loading, error, fetchAllOrders, updateOrderStatus } = useOrder();
const selectedOrder = ref<Order | null>(null);
const showModal = ref(false);
const submitting = ref(false);

// Toast state
const toast = ref<{ message: string; type: "success" | "error" } | null>(null);
const showToast = (message: string, type: "success" | "error") => {
  toast.value = { message, type };
  setTimeout(() => (toast.value = null), 3000);
};

onMounted(async () => {
  await fetchAllOrders();
});

const openDetailModal = (order: Order) => {
  selectedOrder.value = order;
  showModal.value = true;
};

const handleUpdateStatus = async (orderId: number, newStatus: string) => {
  if (!confirm(`Bạn có chắc muốn chuyển trạng thái sang "${newStatus}"?`)) return;
  submitting.value = true;
  try {
    await updateOrderStatus(orderId, newStatus);
    showToast("Cập nhật trạng thái thành công", "success");
    await fetchAllOrders();
    if (selectedOrder.value?.id === orderId) {
      selectedOrder.value = orders.value.find(o => o.id === orderId) || null;
    }
  } catch (err) {
    showToast("Lỗi khi cập nhật trạng thái", "error");
  } finally {
    submitting.value = false;
  }
};

const getStatusBadgeClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return "badge-warning";
    case "confirmed": return "badge-info";
    case "shipping": return "badge-primary";
    case "delivered": return "badge-success";
    case "cancelled": return "badge-error";
    default: return "badge-secondary";
  }
};

const getStatusText = (status: string) => {
  switch (status.toLowerCase()) {
    case "pending": return "Chờ xác nhận";
    case "confirmed": return "Đã xác nhận";
    case "shipping": return "Đang giao hàng";
    case "delivered": return "Đã giao hàng";
    case "cancelled": return "Đã hủy";
    default: return status;
  }
};

const getPaymentStatusBadgeClass = (status: string) => {
  return status.toLowerCase() === "paid" ? "badge-success" : "badge-error";
};

const getPaymentStatusText = (status: string) => {
  return status.toLowerCase() === "paid" ? "Đã thanh toán" : "Chưa thanh toán";
};

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toLocaleString("vi-VN");
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(price);
};
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="header">
        <div>
          <h1 class="title">Quản lý đơn hàng</h1>
          <p class="subtitle">Xem và cập nhật trạng thái đơn hàng của khách hàng</p>
        </div>
      </div>

      <div v-if="loading && !orders.length" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <div v-else-if="error" class="error-state">
        <p>{{ error }}</p>
        <button class="btn btn-primary" @click="fetchAllOrders">Thử lại</button>
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ngày đặt</th>
              <th>Khách hàng</th>
              <th>Tổng tiền</th>
              <th>Thanh toán</th>
              <th>Trạng thái</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.id">
              <td>#{{ order.id }}</td>
              <td>{{ formatDate(order.created_at) }}</td>
              <td>
                <div class="font-medium text-gray-900">User ID: {{ order.user_id }}</div>
                <div class="text-xs text-gray-500">{{ order.phone }}</div>
              </td>
              <td class="font-medium text-blue-600">
                {{ formatPrice(order.total_price) }}
              </td>
              <td>
                <span :class="['badge', getPaymentStatusBadgeClass(order.payment_status)]">
                  {{ getPaymentStatusText(order.payment_status) }}
                </span>
                <div class="text-[10px] text-gray-400 mt-1">{{ order.payment_method }}</div>
              </td>
              <td>
                <span :class="['badge', getStatusBadgeClass(order.status)]">
                  {{ getStatusText(order.status) }}
                </span>
              </td>
              <td>
                <div class="flex gap-2">
                  <button class="btn-icon btn-view" @click="openDetailModal(order)" title="Xem chi tiết">
                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-eye">
                      <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div v-if="orders.length === 0" class="text-center py-8 text-gray-500">
          Chưa có đơn hàng nào.
        </div>
      </div>
    </div>

    <!-- Order Detail Modal -->
    <div v-if="showModal && selectedOrder" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>Chi tiết đơn hàng #{{ selectedOrder.id }}</h2>
          <button @click="showModal = false" class="close-btn">✕</button>
        </div>

        <div class="modal-body">
          <div class="grid grid-cols-2 gap-6 mb-6">
            <div class="info-group">
              <label class="info-label">Thông tin khách hàng</label>
              <div class="info-content">
                <p><strong>User ID:</strong> {{ selectedOrder.user_id }}</p>
                <p><strong>Số điện thoại:</strong> {{ selectedOrder.phone }}</p>
                <p><strong>Địa chỉ:</strong> {{ selectedOrder.address }}</p>
              </div>
            </div>
            <div class="info-group">
              <label class="info-label">Thông tin đơn hàng</label>
              <div class="info-content">
                <p><strong>Ngày đặt:</strong> {{ formatDate(selectedOrder.created_at) }}</p>
                <p><strong>Phương thức:</strong> {{ selectedOrder.payment_method }}</p>
                <p><strong>Thanh toán:</strong> {{ getPaymentStatusText(selectedOrder.payment_status) }}</p>
              </div>
            </div>
          </div>

          <div class="order-items-section mb-6">
            <label class="info-label">Sản phẩm đã đặt</label>
            <div class="items-list">
              <div v-for="item in selectedOrder.items" :key="item.id" class="item-card">
                <div class="item-info">
                  <p class="item-name">Sản phẩm ID: {{ item.product_id }}</p>
                  <p class="item-meta">SL: {{ item.quantity }} x {{ formatPrice(item.price) }}</p>
                </div>
                <div class="item-total">
                  {{ formatPrice(item.price * item.quantity) }}
                </div>
              </div>
            </div>
            <div v-if="selectedOrder.voucher" class="voucher-info mt-2 p-2 bg-blue-50 rounded border border-blue-100 text-blue-700 text-sm">
                Voucher áp dụng: <strong>{{ selectedOrder.voucher.code }}</strong> (-{{ formatPrice(selectedOrder.voucher.discount_value) }})
            </div>
            <div class="order-summary mt-4 pt-4 border-t">
              <div class="flex justify-between items-center text-lg font-bold">
                <span>Tổng cộng:</span>
                <span class="text-blue-600">{{ formatPrice(selectedOrder.total_price) }}</span>
              </div>
            </div>
          </div>

          <div class="status-management">
            <label class="info-label">Cập nhật trạng thái</label>
            <div class="flex flex-wrap gap-2 mt-2">
              <button 
                v-if="selectedOrder.status === 'pending'"
                class="btn btn-info flex-1" 
                @click="handleUpdateStatus(selectedOrder.id, 'confirmed')"
                :disabled="submitting"
              >Xác nhận đơn</button>
              
              <button 
                v-if="selectedOrder.status === 'confirmed'"
                class="btn btn-primary flex-1" 
                @click="handleUpdateStatus(selectedOrder.id, 'shipping')"
                :disabled="submitting"
              >Giao hàng</button>
              
              <button 
                v-if="selectedOrder.status === 'shipping'"
                class="btn btn-success flex-1" 
                @click="handleUpdateStatus(selectedOrder.id, 'delivered')"
                :disabled="submitting"
              >Hoàn tất</button>
              
              <button 
                v-if="['pending', 'confirmed'].includes(selectedOrder.status)"
                class="btn btn-error flex-1" 
                @click="handleUpdateStatus(selectedOrder.id, 'cancelled')"
                :disabled="submitting"
              >Hủy đơn</button>
              
              <div v-if="selectedOrder.status === 'delivered'" class="text-green-600 font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>
                Đơn hàng đã hoàn tất
              </div>
              
              <div v-if="selectedOrder.status === 'cancelled'" class="text-red-600 font-medium flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/></svg>
                Đơn hàng đã bị hủy
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div v-if="toast" :class="['toast', toast.type === 'success' ? 'bg-green-600' : 'bg-red-600']">
        {{ toast.message }}
      </div>
    </transition>
  </div>
</template>

<style scoped>
.page-container {
  min-height: 100vh;
  background-color: #f9fafb;
  padding: 24px;
}

.content-wrapper {
  max-width: 100%;
  margin: 0;
}

/* Header */
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
}
.title {
  font-size: 1.875rem;
  font-weight: 700;
  color: #111827;
  margin: 0 0 0.5rem 0;
}
.subtitle {
  color: #6b7280;
  margin: 0;
}

/* Table Style */
.table-wrapper {
  background: white;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}
.data-table th {
  background: #f3f4f6;
  padding: 12px 16px;
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  color: #6b7280;
  font-weight: 600;
}
.data-table td {
  padding: 12px 16px;
  border-bottom: 1px solid #e5e7eb;
  font-size: 14px;
  color: #374151;
}
.data-table tr:hover {
  background-color: #f9fafb;
}

/* Badges */
.badge {
  padding: 4px 8px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
}
.badge-warning { background: #fef3c7; color: #d97706; }
.badge-info { background: #e0f2fe; color: #0284c7; }
.badge-primary { background: #dbeafe; color: #2563eb; }
.badge-success { background: #dcfce7; color: #16a34a; }
.badge-error { background: #fee2e2; color: #dc2626; }
.badge-secondary { background: #f3f4f6; color: #6b7280; }

/* Buttons */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}
.btn-primary { background: #2563eb; color: white; }
.btn-primary:hover { background: #1d4ed8; }
.btn-success { background: #16a34a; color: white; }
.btn-success:hover { background: #15803d; }
.btn-info { background: #0284c7; color: white; }
.btn-info:hover { background: #0369a1; }
.btn-error { background: #dc2626; color: white; }
.btn-error:hover { background: #b91c1c; }
.btn-disabled { opacity: 0.5; cursor: not-allowed; }

.btn-icon {
  padding: 6px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-view {
  background: #f3f4f6;
  color: #374151;
}
.btn-view:hover {
  background: #e5e7eb;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 50;
  padding: 16px;
}
.modal {
  background: white;
  width: 100%;
  max-width: 700px;
  border-radius: 12px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  max-height: 90vh;
  display: flex;
  flex-direction: column;
}
.modal-header {
  padding: 16px 24px;
  border-bottom: 1px solid #e5e7eb;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.modal-header h2 {
  font-size: 18px;
  font-weight: 600;
  margin: 0;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: #9ca3af;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
}

.info-label {
  display: block;
  font-size: 13px;
  font-weight: 600;
  color: #9ca3af;
  text-transform: uppercase;
  margin-bottom: 8px;
  letter-spacing: 0.025em;
}

.info-content p {
  margin: 4px 0;
  font-size: 14px;
  color: #374151;
}

.item-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px;
  background: #f9fafb;
  border-radius: 8px;
  margin-bottom: 8px;
}

.item-name {
  font-weight: 500;
  color: #111827;
}

.item-meta {
  font-size: 12px;
  color: #6b7280;
}

.item-total {
  font-weight: 600;
  color: #111827;
}

/* Toast */
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  padding: 12px 24px;
  border-radius: 8px;
  color: white;
  font-weight: 500;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  z-index: 100;
}

/* Utilities */
.loading-state, .error-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  text-align: center;
  color: #6b7280;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid #f3f4f6;
  border-top-color: #2563eb;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin: 0 auto 16px;
}
@keyframes spin {
  to { transform: rotate(360deg); }
}

.flex { display: flex; }
.flex-col { flex-direction: column; }
.flex-wrap { flex-wrap: wrap; }
.flex-1 { flex: 1 1 0%; }
.grid { display: grid; }
.grid-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.gap-2 { gap: 8px; }
.gap-6 { gap: 24px; }
.mb-6 { margin-bottom: 24px; }
.mt-2 { margin-top: 8px; }
.mt-4 { margin-top: 16px; }
.pt-4 { padding-top: 16px; }
.border-t { border-top: 1px solid #e5e7eb; }
.items-center { align-items: center; }
.justify-between { justify-content: space-between; }
.font-bold { font-weight: 700; }
.text-lg { font-size: 1.125rem; }
.text-blue-600 { color: #2563eb; }
.text-green-600 { color: #16a34a; }
.text-red-600 { color: #dc2626; }
</style>
