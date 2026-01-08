<script setup lang="ts">
import { ref, onMounted } from "vue";
import { productApi } from "../../composables/productApi";
import type { Product } from "../../@type/product";
import {
  Search,
  Star,
  ShoppingBag,
  Heart,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
} from "lucide-vue-next";

const selectedCategory = ref("Tất cả");
const sortBy = ref("featured");
const priceRange = ref({ min: "", max: "" });
const products = ref<Product[]>([]);
const { getProducts } = productApi();
const IMAGE_BASE_URL = "http://localhost:8081/uploads/products";

onMounted(async () => {
  try {
    const data = await getProducts();
    products.value = data;
  } catch (err) {
    console.error("Lỗi lấy danh sách sản phẩm:", err);
  }
});

const categories = [
  "Tất cả",
  "Chăm Sóc Da",
  "Trang Điểm",
  "Nước Hoa",
  "Body Care",
];

const formatPrice = (price: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(price);
};
</script>

<template>
  <div class="shop-page">
    <header class="page-header">
      <div class="container">
        <h1 class="page-title">Bộ Sưu Tập</h1>
        <div class="breadcrumbs">
          <span>Trang Chủ</span>
          <span class="divider">/</span>
          <span class="current">Cửa Hàng</span>
        </div>
      </div>
    </header>

    <div class="container main-layout">
      <aside class="sidebar">
        <div class="sidebar-section">
          <div class="search-box">
            <input type="text" placeholder="Tìm kiếm..." />
            <button class="search-btn">
              <Search :size="18" />
            </button>
          </div>
        </div>

        <div class="sidebar-section">
          <h3 class="filter-title">Danh Mục</h3>
          <ul class="category-list">
            <li
              v-for="cat in categories"
              :key="cat"
              :class="{ active: selectedCategory === cat }"
            >
              <label>
                <input
                  type="radio"
                  name="category"
                  :value="cat"
                  v-model="selectedCategory"
                />
                <span class="cat-name">{{ cat }}</span>
                <span class="check-icon" v-if="selectedCategory === cat"></span>
              </label>
            </li>
          </ul>
        </div>

        <div class="sidebar-section">
          <h3 class="filter-title">Khoảng Giá</h3>
          <div class="price-inputs">
            <input type="number" v-model="priceRange.min" placeholder="Từ" />
            <span class="separator">-</span>
            <input type="number" v-model="priceRange.max" placeholder="Đến" />
          </div>
        </div>
      </aside>

      <main class="product-content">
        <div class="toolbar">
          <p class="result-count">
            Hiển thị <strong>{{ products.length }}</strong> sản phẩm
          </p>

          <div class="sort-wrapper">
            <div class="custom-select-wrapper">
              <select class="sort-select" v-model="sortBy">
                <option value="featured">Phổ biến nhất</option>
                <option value="price-asc">Giá: Thấp đến Cao</option>
                <option value="price-desc">Giá: Cao đến Thấp</option>
              </select>
              <SlidersHorizontal :size="14" class="select-icon" />
            </div>
          </div>
        </div>

        <div class="product-grid">
          <div
            v-for="product in products"
            :key="product.id"
            class="product-card group"
          >
            <NuxtLink :to="`/shop/products/${product.id}`" class="image-link">
              <div class="card-image-wrapper">
                <img
                  v-if="product.images?.length"
                  :src="`${IMAGE_BASE_URL}/${product.images[0]}`"
                  class="product-img"
                />
                <div v-else class="no-image">No Image</div>

                <div class="badges">
                  <span class="badge badge-new">New</span>
                </div>

                <div class="card-actions">
                  <button class="btn-action btn-wishlist">
                    <Heart :size="20" />
                  </button>
                  <button class="btn-action btn-add-cart">
                    <ShoppingBag :size="18" style="margin-right: 6px" /> Thêm
                  </button>
                </div>
              </div>
            </NuxtLink>

            <div class="card-info">
              <h3 class="product-name">
                <NuxtLink :to="`shop/products/${product.id}`">
                  {{ product.name }}
                </NuxtLink>
              </h3>

              <div class="rating">
                <div class="stars">
                  <Star
                    v-for="n in 5"
                    :key="n"
                    :size="12"
                    :class="[
                      'star',
                      // { filled: n <= Math.floor(product.rating || 5) },
                      { filled: n <= Math.floor(5) },
                    ]"
                  />
                </div>
                <!-- <span class="review-count"
                  >({{ product.reviews || 0 }} đánh giá)</span -->

                <span class="review-count">({{ 0 }} đánh giá)</span>
              </div>

              <div class="price-box">
                <span class="price-current">{{
                  formatPrice(product.price)
                }}</span>
              </div>
            </div>
          </div>
        </div>

        <div class="pagination">
          <button class="page-btn"><ChevronLeft :size="18" /></button>
          <button class="page-btn active">1</button>
          <button class="page-btn">2</button>
          <button class="page-btn">3</button>
          <button class="page-btn"><ChevronRight :size="18" /></button>
        </div>
      </main>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary: #db2777;
  --primary-hover: #be185d;
  --bg-soft: #fdf2f8;
  --text-main: #1f2937;
  --text-light: #6b7280;
  --border: #e5e7eb;
  --white: #ffffff;
  --shadow-sm: 0 1px 2px 0 rgb(0 0 0 / 0.05);
  --shadow-md: 0 4px 6px -1px rgb(0 0 0 / 0.1);
  --radius: 12px;
  --font-serif: "Merriweather", serif;
  --font-sans: "Inter", sans-serif;
}

.shop-page {
  background-color: var(--white);
  font-family: var(--font-sans);
  color: var(--text-main);
  padding-bottom: 100px;
}

.container {
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 24px;
}
.page-header {
  background: linear-gradient(to bottom, var(--bg-soft), #fff);
  padding: 60px 0 40px;
  text-align: center;
  margin-bottom: 50px;
}

.page-title {
  font-family: var(--font-serif);
  font-weight: bold;
  font-size: 2.5rem;
  color: var(--text-main);
  margin-bottom: 10px;
}

.breadcrumbs {
  font-size: 0.9rem;
  color: var(--text-light);
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 8px;
}
.breadcrumbs .current {
  color: var(--primary);
  font-weight: 600;
}

.main-layout {
  display: flex;
  gap: 48px;
}
.sidebar {
  width: 260px;
  flex-shrink: 0;
}
.sidebar-section {
  margin-bottom: 40px;
}

.filter-title {
  font-family: var(--font-serif);
  font-size: 1.1rem;
  margin-bottom: 16px;
  color: var(--text-main);
  border-bottom: 2px solid var(--bg-soft);
  padding-bottom: 8px;
  display: inline-block;
}

.search-box {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid var(--border);
  transition: all 0.3s;
}
.search-box:focus-within {
  border-color: var(--primary);
  box-shadow: 0 0 0 3px var(--bg-soft);
}
.search-box input {
  width: 100%;
  padding: 12px 40px 12px 12px;
  border: none;
  outline: none;
  font-size: 0.95rem;
}
.search-btn {
  position: absolute;
  right: 0;
  top: 0;
  bottom: 0;
  width: 40px;
  background: none;
  border: none;
  color: var(--text-light);
  cursor: pointer;
}

.category-list {
  list-style: none;
  padding: 0;
}
.category-list li {
  margin-bottom: 8px;
}
.category-list label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  color: var(--text-light);
  transition: all 0.2s;
}
.category-list input {
  display: none;
}

.category-list li:hover label {
  background: var(--bg-soft);
  color: var(--primary);
}
.category-list li.active label {
  background: var(--bg-soft);
  color: blue;
  font-weight: 600;
}
.check-icon {
  width: 6px;
  height: 6px;
  background: var(--primary);
  border-radius: 50%;
}

.price-inputs {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 12px;
}
.price-inputs input {
  width: 100%;
  padding: 8px;
  border: 1px solid var(--border);
  border-radius: 6px;
  font-size: 0.9rem;
  outline: none;
  text-align: center;
}
.price-inputs input:focus {
  border-color: var(--primary);
}
.separator {
  color: var(--text-light);
}

.btn-apply {
  width: 100%;
  padding: 10px;
  background: var(--text-main);
  color: #fff;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
  transition: 0.3s;
}
.btn-apply:hover {
  background: var(--primary);
}

.product-content {
  flex: 1;
}

.toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 32px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--border);
}

.custom-select-wrapper {
  position: relative;
}
.sort-select {
  appearance: none;
  padding: 8px 32px 8px 12px;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: #fff;
  cursor: pointer;
  font-size: 0.9rem;
}
.select-icon {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
  pointer-events: none;
  color: var(--text-light);
}

/* --- GRID & CARD --- */
.product-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 32px;
}

.product-card {
  display: flex;
  flex-direction: column;
}

.card-image-wrapper {
  position: relative;
  aspect-ratio: 3/4;
  border-radius: var(--radius);
  overflow: hidden;
  background: #f9fafb;
  margin-bottom: 16px;
  cursor: pointer;
}

.product-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
}
.product-card:hover .product-img {
  transform: scale(1.08);
}

.no-image {
  width: 100%;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ccc;
}

.badges {
  position: absolute;
  top: 12px;
  left: 12px;
  z-index: 2;
}
.badge {
  padding: 4px 10px;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  border-radius: 4px;
  letter-spacing: 0.5px;
}
.badge-new {
  background: #fff;
  color: var(--text-main);
  box-shadow: var(--shadow-sm);
}

.card-actions {
  position: absolute;
  bottom: 12px;
  left: 12px;
  right: 12px;
  display: flex;
  gap: 8px;
  z-index: 5;
}

.btn-action {
  border: none;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  backdrop-filter: blur(4px);
  opacity: 0;
  transform: translateY(20px);
}

.btn-wishlist {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.9);
  color: var(--text-main);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.btn-wishlist:hover {
  background: #fff;
  color: var(--primary);
  transform: scale(1.1);
}

.btn-add-cart {
  flex: 1;
  height: 44px;
  border-radius: 22px;
  background: rgba(255, 255, 255, 0.95);
  color: var(--text-main);
  font-weight: 600;
  font-size: 0.9rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}
.btn-add-cart:hover {
  background: var(--primary);
  color: #fff;
}

.product-card:hover .btn-action {
  opacity: 1;
  transform: translateY(0);
}
.product-card:hover .btn-add-cart {
  transition-delay: 0.05s;
}

.product-cat {
  font-size: 0.75rem;
  color: var(--text-light);
  text-transform: uppercase;
  letter-spacing: 1px;
}
.product-name a {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  text-decoration: none;
  color: var(--text-main);
  font-family: var(--font-serif);
  font-size: 1.1rem;
  font-weight: 700;
  margin: 6px 0 8px;
  line-height: 1.4;
  transition: color 0.2s;
}
.product-name a:hover {
  color: var(--primary);
}

.rating {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 8px;
}
.stars {
  display: flex;
  color: #e5e7eb;
}
.star.filled {
  color: #facc15;
  fill: currentColor;
}
.review-count {
  font-size: 0.8rem;
  color: var(--text-light);
}

.price-box {
  display: flex;
  align-items: center;
  gap: 10px;
}
.price-current {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--text-main);
}
.price-old {
  font-size: 0.9rem;
  text-decoration: line-through;
  color: var(--text-light);
}

/* Pagination */
.pagination {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 60px;
}
.page-btn {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 1px solid var(--border);
  background: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: 0.2s;
  color: var(--text-light);
}
.page-btn:hover {
  border-color: var(--primary);
  color: var(--primary);
}
.page-btn.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
  box-shadow: 0 4px 10px rgba(219, 39, 119, 0.3);
}
.pagination {
  margin-top: 50px;
  display: flex;
  justify-content: center;
  gap: 12px;
}

.page-btn {
  width: 44px;
  height: 44px;
  border-radius: 14px;
  border: none;
  background: #f3f3f3;
  font-weight: 600;
  cursor: pointer;
  transition: 0.25s;
  color: #444;
}

.page-btn:hover {
  background: #ff3d71;
  color: #fff;
}

.page-btn.active {
  background: linear-gradient(135deg, #ff6b9c, #ff3d71);
  color: white;
  box-shadow: 0 6px 16px rgba(255, 61, 113, 0.35);
}

/* Responsive */
@media (max-width: 1024px) {
  .product-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .main-layout {
    gap: 30px;
  }
}

@media (max-width: 768px) {
  .main-layout {
    flex-direction: column;
  }
  .sidebar {
    width: 100%;
  }
  .page-title {
    font-size: 2rem;
  }
  .product-grid {
    gap: 20px;
  }
}

@media (max-width: 480px) {
  .product-grid {
    grid-template-columns: 1fr;
  }
}
</style>
