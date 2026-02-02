<script setup lang="ts">
import { useOrder } from "@/composables/useOrdes"; // Assume you have this
import { useNotification } from "@/composables/useNotification";

definePageMeta({
  layout: "admin",
});

const { getOrders, loading } = useOrder(); // Giả sử bạn đã có
const { showNotification } = useNotification();

const orders = ref<any[]>([]);
const searchQuery = ref("");
const statusFilter = ref("all");

const fetchOrders = async () => {
  try {
    orders.value = await getOrders();
  } catch (error: any) {
    showNotification("Lỗi", "Không thể tải danh sách đơn hàng", "error");
  }
};

const filteredOrders = computed(() => {
  return orders.value.filter((order) => {
    const matchSearch = order.id.toString().includes(searchQuery.value);
    const matchStatus =
      statusFilter.value === "all" || order.shipping_status === statusFilter.value;
    return matchSearch && matchStatus;
  });
});

onMounted(() => {
  fetchOrders();
});
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Quản lý vận chuyển</h1>
      <p class="text-gray-600 mt-1">Danh sách đơn hàng cần xử lý</p>
    </div>

    <!-- Filters -->
    <div class="bg-white rounded-lg shadow-sm p-4 mb-6">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <input
          v-model="searchQuery"
          type="text"
          placeholder="Tìm mã đơn hàng..."
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        />
        <select
          v-model="statusFilter"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">Tất cả trạng thái</option>
          <option value="pending">Chờ xử lý</option>
          <option value="in_transit">Đang vận chuyển</option>
          <option value="delivered">Đã giao</option>
        </select>
      </div>
    </div>

    <!-- Orders Table -->
    <div class="bg-white rounded-lg shadow-sm overflow-hidden">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Mã đơn
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Khách hàng
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Trạng thái
            </th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Ngày tạo
            </th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="order in filteredOrders" :key="order.id" class="hover:bg-gray-50">
            <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
              #{{ order.id }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ order.customer_name || "N/A" }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap">
              <ShippingStatusBadge :status="order.shipping_status || 'pending'" />
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
              {{ new Date(order.created_at).toLocaleDateString("vi-VN") }}
            </td>
            <td class="px-6 py-4 whitespace-nowrap text-right text-sm">
              <NuxtLink
                :to="`/admin/shipping/tracking/${order.id}`"
                class="text-blue-600 hover:text-blue-800 font-medium"
              >
                Cập nhật →
              </NuxtLink>
            </td>
          </tr>
        </tbody>
      </table>

      <div v-if="loading" class="text-center py-12 text-gray-500">
        Đang tải...
      </div>

      <div v-if="!loading && filteredOrders.length === 0" class="text-center py-12 text-gray-500">
        Không có đơn hàng nào
      </div>
    </div>
  </div>
</template>