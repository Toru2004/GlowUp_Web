<script setup lang="ts">
import { useStore } from "@/composables/useStore";
import type { Store } from "@/@type/store";

definePageMeta({
  layout: "admin", 
});

const { getMyStores, loading } = useStore();

const myStores = ref<Store[]>([]);

const fetchMyStores = async () => {
  try {
    myStores.value = await getMyStores();
  } catch (error) {
    console.error(error);
  }
};

onMounted(() => {
  fetchMyStores();
});
</script>

<template>
  <div>
    <div class="mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Cửa hàng của tôi</h1>
      <p class="text-gray-600 mt-1">Danh sách cửa hàng bạn đang quản lý</p>
    </div>

    <div v-if="loading" class="text-center py-12">Đang tải...</div>

    <div v-else-if="myStores.length === 0" class="text-center py-12">
      <p class="text-gray-500">Bạn chưa được phân công quản lý cửa hàng nào</p>
    </div>

    <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div
        v-for="store in myStores"
        :key="store.id"
        class="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <h3 class="text-lg font-bold text-gray-900 mb-4">{{ store.name }}</h3>

        <div class="space-y-2 text-sm text-gray-600">
          <div class="flex items-start gap-2">
            <svg
              class="w-5 h-5 text-gray-400 flex-shrink-0 mt-0.5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
              />
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
            <span>{{ store.address_detail }}</span>
          </div>

          <div v-if="store.phone" class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
              />
            </svg>
            <span>{{ store.phone }}</span>
          </div>

          <div v-if="store.email" class="flex items-center gap-2">
            <svg
              class="w-5 h-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
              />
            </svg>
            <span>{{ store.email }}</span>
          </div>
        </div>

        <div class="mt-4">
          
            :href="`https://www.google.com/maps?q=${store.latitude},${store.longitude}`"
            target="_blank"
            class="block text-center px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700"
          <a>
           Xem bản đồ
          </a>
        </div>
      </div>
    </div>
  </div>
</template>