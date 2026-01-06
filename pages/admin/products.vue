<script setup lang="ts">
import { ref, reactive, onMounted } from "vue";
import { productApi } from "../../composables/productApi";
import type { Product } from "../../@type/product";

definePageMeta({
  layout: "admin",
});

const api = productApi();
const products = ref<Product[]>([]);
const loading = ref(true);
const showModal = ref(false);
const submitting = ref(false);
const editingId = ref<number | string | null>(null);

const form = reactive({
  name: "",
  brand: "",
  gender: "Unisex",
  price: 0,
  quantity: 0,
  description: "",
});

// File upload state
const selectedFiles = ref<File[]>([]);
const previewImages = ref<string[]>([]);
const currentImages = ref<string[]>([]);

// Toast state
const toast = ref<{ message: string; type: "success" | "error" } | null>(null);
const showToast = (message: string, type: "success" | "error") => {
  toast.value = { message, type };
  setTimeout(() => (toast.value = null), 3000);
};

// Helper Functions
const parseImages = (images: any): string[] => {
  if (Array.isArray(images)) return images;
  if (typeof images === "string" && images) {
    try {
      return JSON.parse(images);
    } catch (e) {
      return [];
    }
  }
  return [];
};

const getImageUrl = (img: string) => {
  return `http://localhost:8081/uploads/products/${img}`;
};

// API
const fetchProducts = async () => {
  loading.value = true;
  try {
    const res = await api.getProducts();
    products.value = res.map((p: any) => ({
      ...p,
      images: parseImages(p.images),
      quantity: p.quantity ?? 0,
    }));
  } catch (err) {
    console.error(err);
    showToast("Lỗi tải danh sách sản phẩm", "error");
  } finally {
    loading.value = false;
  }
};

const handleDelete = async (id: number | string) => {
  if (!confirm("Bạn có chắc chắn muốn xóa sản phẩm này?")) return;
  try {
    await api.deleteProduct(id);
    showToast("Xóa sản phẩm thành công", "success");
    await fetchProducts();
  } catch (err) {
    console.error(err);
    showToast("Lỗi khi xóa sản phẩm", "error");
  }
};

//  Form & Modal Handlers
const openModal = (product?: Product) => {
  selectedFiles.value = [];
  previewImages.value = [];
  currentImages.value = [];

  if (product) {
    editingId.value = product.id!;
    form.name = product.name;
    form.brand = product.brand;
    form.gender = product.gender;
    form.price = product.price;
    form.quantity = product.quantity || 0;
    form.description = product.description;

    currentImages.value = Array.isArray(product.images) ? product.images : [];
  } else {
    editingId.value = null;
    form.name = "";
    form.brand = "";
    form.gender = "Unisex";
    form.price = 0;
    form.quantity = 0;
    form.description = "";
  }
  showModal.value = true;
};

const handleFileChange = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    const files = Array.from(target.files);
    selectedFiles.value = files;
    previewImages.value = files.map((file) => URL.createObjectURL(file));
  }
};

const handleSubmit = async () => {
  submitting.value = true;
  try {
    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("brand", form.brand);
    formData.append("gender", form.gender);
    formData.append("price", String(form.price));
    formData.append("quantity", String(form.quantity));
    formData.append("description", form.description);

    selectedFiles.value.forEach((file) => formData.append("images", file));

    if (editingId.value) {
      // Nếu không chọn file mới thì gửi lại ảnh cũ
      if (currentImages.value.length > 0 && selectedFiles.value.length === 0) {
        currentImages.value.forEach((img) => formData.append("images[]", img));
      }

      await api.updateProduct(editingId.value, formData);
      showToast("Cập nhật sản phẩm thành công", "success");
    } else {
      await api.createProduct(formData);
      showToast("Thêm sản phẩm thành công", "success");
    }

    showModal.value = false;
    await fetchProducts();
  } catch (err) {
    console.error(err);
    showToast("Có lỗi xảy ra khi lưu", "error");
  } finally {
    submitting.value = false;
  }
};

onMounted(() => {
  fetchProducts();
});
</script>

<template>
  <div class="page-container">
    <div class="content-wrapper">
      <div class="header">
        <div>
          <h1 class="title">Quản lý sản phẩm</h1>
          <p class="subtitle">Danh sách và quản lý kho hàng</p>
        </div>
        <button class="btn btn-primary" @click="openModal()">
          <span>+ Thêm sản phẩm</span>
        </button>
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Đang tải dữ liệu...</p>
      </div>

      <div v-else class="table-wrapper">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Ảnh</th>
              <th>Tên sản phẩm</th>
              <th>Giá</th>
              <th>Kho</th>
              <th>Thương hiệu</th>
              <th>Giới tính</th>
              <th>Hành động</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="p in products" :key="p.id">
              <td>#{{ p.id }}</td>
              <td>
                <div class="img-grid">
                  <img
                    v-if="p.images && p.images.length > 0"
                    :src="getImageUrl(p.images[0])"
                    class="main-thumb"
                    alt="Product"
                  />
                  <span v-else class="no-img">No Img</span>
                </div>
              </td>
              <td>
                <div class="font-medium text-gray-900">{{ p.name }}</div>
                <div class="text-xs text-gray-500 truncate max-w-[200px]">
                  {{ p.description }}
                </div>
              </td>
              <td class="font-medium text-blue-600">
                {{ new Intl.NumberFormat("vi-VN").format(p.price) }}₫
              </td>
              <td>
                <span
                  :class="[
                    'badge',
                    (p.quantity || 0) > 0 ? 'badge-success' : 'badge-error',
                  ]"
                >
                  {{ p.quantity }}
                </span>
              </td>
              <td>{{ p.brand }}</td>
              <td>{{ p.gender }}</td>
              <td>
                <div class="flex gap-2">
                  <button
                    class="btn-icon btn-edit"
                    @click="openModal(p)"
                    title="Sửa"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-square-pen-icon lucide-square-pen"
                    >
                      <path
                        d="M12 3H5a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                      />
                      <path
                        d="M18.375 2.625a1 1 0 0 1 3 3l-9.013 9.014a2 2 0 0 1-.853.505l-2.873.84a.5.5 0 0 1-.62-.62l.84-2.873a2 2 0 0 1 .506-.852z"
                      />
                    </svg>
                  </button>
                  <button
                    class="btn-icon btn-delete"
                    @click="handleDelete(p.id!)"
                    title="Xóa"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      class="lucide lucide-trash2-icon lucide-trash-2"
                    >
                      <path d="M10 11v6" />
                      <path d="M14 11v6" />
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" />
                      <path d="M3 6h18" />
                      <path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>

        <div
          v-if="products.length === 0"
          class="text-center py-8 text-gray-500"
        >
          Chưa có sản phẩm nào.
        </div>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal">
        <div class="modal-header">
          <h2>{{ editingId ? "Cập nhật sản phẩm" : "Thêm sản phẩm mới" }}</h2>
          <button @click="showModal = false" class="close-btn">✕</button>
        </div>

        <div class="modal-body">
          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label>Tên sản phẩm <span class="text-red-500">*</span></label>
              <input
                v-model="form.name"
                type="text"
                class="input"
                placeholder="VD: Nước hoa"
              />
            </div>
            <div class="form-group">
              <label>Thương hiệu</label>
              <input
                v-model="form.brand"
                type="text"
                class="input"
                placeholder="VD: Dior"
              />
            </div>
          </div>

          <div class="grid grid-cols-2 gap-4">
            <div class="form-group">
              <label>Giá tiền (VNĐ) <span class="text-red-500">*</span></label>
              <input v-model="form.price" type="number" class="input" min="0" />
            </div>
            <div class="form-group">
              <label>Số lượng kho</label>
              <input
                v-model="form.quantity"
                type="number"
                class="input"
                min="0"
              />
            </div>
          </div>

          <div class="form-group">
            <label>Giới tính</label>
            <select v-model="form.gender" class="input">
              <option value="Male">Nam</option>
              <option value="Female">Nữ</option>
              <option value="Unisex">Unisex</option>
            </select>
          </div>

          <div class="form-group">
            <label>Hình ảnh</label>
            <input
              type="file"
              multiple
              @change="handleFileChange"
              class="input file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />

            <div
              v-if="previewImages.length > 0"
              class="mt-2 flex gap-2 overflow-x-auto pb-2"
            >
              <img
                v-for="src in previewImages"
                :key="src"
                :src="src"
                class="h-16 w-16 object-cover rounded border"
              />
            </div>
            <div v-else-if="currentImages.length > 0" class="mt-2">
              <p class="text-xs text-gray-500 mb-1">Ảnh hiện tại:</p>
              <div class="flex gap-2 overflow-x-auto pb-2">
                <img
                  v-for="img in currentImages"
                  :key="img"
                  :src="getImageUrl(img)"
                  class="h-16 w-16 object-cover rounded border"
                />
              </div>
            </div>
          </div>

          <div class="form-group">
            <label>Mô tả chi tiết</label>
            <textarea
              v-model="form.description"
              rows="3"
              class="input"
              placeholder="Thông tin sản phẩm..."
            ></textarea>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn btn-secondary" @click="showModal = false">
            Hủy
          </button>
          <button
            class="btn btn-primary"
            :disabled="submitting"
            @click="handleSubmit"
          >
            {{ submitting ? "Đang lưu..." : "Lưu sản phẩm" }}
          </button>
        </div>
      </div>
    </div>

    <transition name="fade">
      <div
        v-if="toast"
        :class="[
          'toast',
          toast.type === 'success' ? 'bg-green-600' : 'bg-red-600',
        ]"
      >
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

/* Images in table */
.img-grid {
  display: flex;
  align-items: center;
}
.main-thumb {
  width: 48px;
  height: 48px;
  object-fit: cover;
  border-radius: 6px;
  border: 1px solid #e5e7eb;
}
.no-img {
  width: 48px;
  height: 48px;
  background: #eee;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 10px;
  color: #999;
  border-radius: 6px;
}

/* Badges */
.badge {
  padding: 4px 8px;
  border-radius: 99px;
  font-size: 12px;
  font-weight: 600;
}
.badge-success {
  background: #dcfce7;
  color: #16a34a;
}
.badge-error {
  background: #fee2e2;
  color: #dc2626;
}

/* Buttons */
.btn {
  padding: 8px 16px;
  border-radius: 6px;
  font-weight: 500;
  transition: all 0.2s;
  cursor: pointer;
  border: none;
}
.btn-primary {
  background: #2563eb;
  color: white;
}
.btn-primary:hover {
  background: #1d4ed8;
}
.btn-primary:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.btn-secondary {
  background: white;
  border: 1px solid #d1d5db;
  color: #374151;
}
.btn-secondary:hover {
  background: #f3f4f6;
}

.btn-icon {
  padding: 6px;
  border-radius: 4px;
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}
.btn-edit {
  background: #eff6ff;
  color: #2563eb;
}
.btn-edit:hover {
  background: #dbeafe;
}
.btn-delete {
  background: #fef2f2;
  color: #ef4444;
}
.btn-delete:hover {
  background: #fee2e2;
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
  max-width: 600px;
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
.form-group {
  margin-bottom: 16px;
}
.form-group label {
  display: block;
  font-size: 14px;
  font-weight: 500;
  color: #374151;
  margin-bottom: 6px;
}
.input {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 14px;
}
.input:focus {
  outline: none;
  border-color: #2563eb;
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
}

.modal-footer {
  padding: 16px 24px;
  background: #f9fafb;
  border-top: 1px solid #e5e7eb;
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

/* Utilities */
.grid {
  display: grid;
}
.grid-cols-2 {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}
.gap-4 {
  gap: 16px;
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
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
