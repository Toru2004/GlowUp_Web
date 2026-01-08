<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import {
  Heart,
  ShoppingBag,
  Minus,
  Plus,
  Truck,
  ShieldCheck,
  Star,
  User,
  CheckCircle2,
} from "lucide-vue-next";

const route = useRoute();
const product = ref<any>(null);
const relatedProducts = ref<any[]>([]);
const reviews = ref<any[]>([]);
const selectedImage = ref("");
const quantity = ref(1);
const loading = ref(true);

const IMAGE_BASE_URL = "http://localhost:8081/uploads/products";

// fake data
const mockReviews = [
  {
    id: 1,
    user: "Nguyễn Thùy Linh",
    rating: 5,
    date: "10/01/2026",
    content: "Sản phẩm dùng rất thích, mùi thơm nhẹ nhàng, giao hàng nhanh!",
    verify: true,
  },
  {
    id: 2,
    user: "Trần Minh",
    rating: 4,
    date: "08/01/2026",
    content: "Đóng gói cẩn thận, shop tư vấn nhiệt tình.",
    verify: true,
  },
  {
    id: 3,
    user: "Le Ha",
    rating: 5,
    date: "05/01/2026",
    content: "Chất lượng tuyệt vời so với giá tiền.",
    verify: false,
  },
];

const mockRelated = [
  {
    id: 101,
    name: "Serum Vitamin C",
    brand: "Balance",
    price: 150000,
    image: "https://placehold.co/300x400?text=Serum",
  },
  {
    id: 102,
    name: "Kem Dưỡng Ẩm",
    brand: "Neutrogena",
    price: 280000,
    image: "https://placehold.co/300x400?text=Cream",
  },
  {
    id: 103,
    name: "Son Môi Matte",
    brand: "MAC",
    price: 550000,
    image: "https://placehold.co/300x400?text=Lipstick",
  },
  {
    id: 104,
    name: "Nước Tẩy Trang",
    brand: "Bioderma",
    price: 320000,
    image: "https://placehold.co/300x400?text=Cleanser",
  },
];

const newReview = ref<{
  user: string;
  rating: number;
  content: string;
}>({
  user: "Khách hàng",
  rating: 5,
  content: "",
});

onMounted(async () => {
  try {
    const res: any = await $fetch(
      `http://localhost:8081/api/products/${route.params.id}`
    );
    product.value = res;
    if (res.images && res.images.length > 0)
      selectedImage.value = res.images[0];
    reviews.value = mockReviews;
    relatedProducts.value = mockRelated;
  } catch (error) {
    console.error("Error:", error);
  } finally {
    loading.value = false;
  }
});

const getImageUrl = (imgName: string) => {
  if (!imgName) return "https://placehold.co/600x600?text=No+Image";
  return imgName.startsWith("http") ? imgName : `${IMAGE_BASE_URL}/${imgName}`;
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(
    price
  );

const increaseQty = () => {
  if (product.value && quantity.value < product.value.quantity)
    quantity.value++;
};
const decreaseQty = () => {
  if (quantity.value > 1) quantity.value--;
};
</script>

<template>
  <div class="page-wrapper">
    <div v-if="loading" class="container loading-view">
      <div class="spinner"></div>
    </div>

    <div v-else-if="product" class="container">
      <nav class="breadcrumbs">
        <a href="/">Trang chủ</a> <span class="sep">/</span>
        <a href="/shop">Cửa hàng</a> <span class="sep">/</span>
        <span class="curr">{{ product.name }}</span>
      </nav>

      <div class="product-top-section">
        <div class="gallery-col">
          <div class="main-img-box">
            <img :src="getImageUrl(selectedImage)" class="main-img" />
          </div>
          <div class="thumb-list">
            <div
              v-for="img in product.images"
              :key="img"
              class="thumb-item"
              :class="{ active: img === selectedImage }"
              @click="selectedImage = img"
            >
              <img :src="getImageUrl(img)" />
            </div>
          </div>
        </div>

        <div class="info-col">
          <div class="brand-tag">{{ product.brand || "No Brand" }}</div>
          <h1 class="p-title">{{ product.name }}</h1>

          <div class="p-rating">
            <div class="stars">
              <Star v-for="n in 5" :key="n" :size="14" class="fill-star" />
            </div>
            <span class="count">({{ reviews.length }} đánh giá)</span>
            <span class="sep">•</span>
            <span class="sold">Đã bán 1.2k</span>
          </div>

          <div class="p-price">
            <span class="curr-price">{{ formatPrice(product.price) }}</span>
          </div>

          <div class="p-desc-short">{{ product.description }}</div>

          <div class="action-box">
            <div class="qty-control">
              <button @click="decreaseQty"><Minus :size="16" /></button>
              <input readonly :value="quantity" />
              <button @click="increaseQty"><Plus :size="16" /></button>
            </div>

            <button class="btn-add-cart">
              <ShoppingBag :size="20" />
              <span>Thêm vào giỏ hàng</span>
            </button>

            <button class="btn-wish"><Heart :size="22" /></button>
          </div>

          <div class="policies">
            <div class="policy-item">
              <Truck :size="20" /> <span>Miễn phí vận chuyển</span>
            </div>
            <div class="policy-item">
              <ShieldCheck :size="20" /> <span>Chính hãng 100%</span>
            </div>
            <div class="policy-item">
              <CheckCircle2 :size="20" /> <span>Đổi trả trong 7 ngày</span>
            </div>
          </div>
        </div>
      </div>

      <div class="divider"></div>

      <div class="content-section" id="reviews">
        <h2 class="section-heading">Đánh Giá & Nhận Xét</h2>

        <div class="review-summary">
          <div class="score-box">
            <span class="big-score">4.8</span>
            <div class="stars">
              <Star v-for="n in 5" :key="n" :size="16" class="fill-star" />
            </div>
            <span class="total-count"
              >Dựa trên {{ reviews.length }} đánh giá</span
            >
          </div>

          <div class="filter-box">
            <button class="filter-btn active">Tất cả</button>
            <button class="filter-btn">5 Sao (120)</button>
            <button class="filter-btn">4 Sao (8)</button>
            <button class="filter-btn">Có hình ảnh (56)</button>
          </div>
        </div>
        <div class="review-form">
          <div class="rf-header">
            <User :size="18" />
            <span>Viết đánh giá của bạn</span>
          </div>

          <div class="rf-stars">
            <Star
              v-for="n in 5"
              :key="n"
              :size="20"
              :class="n <= newReview.rating ? 'fill-star' : 'gray-star'"
              @click="newReview.rating = n"
            />
          </div>

          <textarea
            v-model="newReview.content"
            placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
          ></textarea>

          <button class="btn-submit-review" @click="">Gửi đánh giá</button>
        </div>

        <div class="review-list">
          <div v-for="review in reviews" :key="review.id" class="review-card">
            <div class="avatar-circle">{{ review.user.charAt(0) }}</div>
            <div class="review-content">
              <div class="r-header">
                <span class="r-name">{{ review.user }}</span>
                <span v-if="review.verify" class="verify-badge"
                  ><CheckCircle2 :size="12" /> Đã mua hàng</span
                >
              </div>
              <div class="r-stars">
                <Star
                  v-for="n in 5"
                  :key="n"
                  :size="12"
                  :class="n <= review.rating ? 'fill-star' : 'gray-star'"
                />
              </div>
              <div class="r-date">{{ review.date }} | Phân loại: 50ml</div>
              <p class="r-text">{{ review.content }}</p>
            </div>
          </div>
        </div>

        <div class="load-more-wrap">
          <button class="btn-outline">Xem thêm đánh giá</button>
        </div>
      </div>

      <div class="related-section">
        <h2 class="section-heading fancy-title">
          <span>Sản Phẩm Tương Tự</span>
        </h2>
        <div class="related-grid">
          <div
            v-for="item in relatedProducts"
            :key="item.id"
            class="product-item"
          >
            <div class="img-wrap">
              <img :src="getImageUrl(item.image)" />
              <div class="overlay-btn">Thêm</div>
            </div>
            <div class="p-info">
              <div class="p-brand">{{ item.brand }}</div>
              <div class="p-name">{{ item.name }}</div>
              <div class="p-price">{{ formatPrice(item.price) }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
:root {
  --primary: #db2777;
  --primary-dark: #be185d;
  --text-main: #111827;
  --text-gray: #6b7280;
  --bg-light: #f9fafb;
  --border: #e5e7eb;
  --font-serif: "Merriweather", serif;
  --font-sans: "Inter", sans-serif;
}

.page-wrapper {
  font-family: var(--font-sans);
  color: var(--text-main);
  background: #fff;
  padding-bottom: 80px;
}
.container {
  max-width: 1140px;
  margin: 0 auto;
  padding: 0 20px;
}
.divider {
  height: 1px;
  background: var(--border);
  margin: 50px 0;
}
.section-heading {
  font-family: var(--font-serif);
  font-size: 1.5rem;
  margin-bottom: 24px;
  color: var(--text-main);
}
.section-heading.center {
  text-align: center;
  margin-bottom: 40px;
}

.breadcrumbs {
  padding: 20px 0 30px;
  font-size: 0.9rem;
  color: var(--text-gray);
}
.breadcrumbs a {
  text-decoration: none;
  color: var(--text-gray);
  transition: 0.2s;
}
.breadcrumbs a:hover {
  color: var(--primary);
}
.breadcrumbs .sep {
  margin: 0 8px;
  font-size: 0.8rem;
}
.breadcrumbs .curr {
  color: var(--text-main);
  font-weight: 500;
}

.product-top-section {
  display: grid;
  grid-template-columns: 45% 50%;
  gap: 5%;
  align-items: start;
  margin-bottom: 40px;
}

.gallery-col {
  position: sticky;
  top: 20px;
}
.main-img-box {
  position: relative;
  border-radius: 12px;
  overflow: hidden;
  background: var(--bg-light);
  aspect-ratio: 1/1;
  border: 1px solid var(--border);
}
.main-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.thumb-list {
  display: flex;
  gap: 12px;
  margin-top: 15px;
  overflow-x: auto;
}
.thumb-item {
  width: 70px;
  height: 70px;
  border-radius: 8px;
  overflow: hidden;
  cursor: pointer;
  border: 2px solid transparent;
  opacity: 0.6;
  transition: 0.2s;
}
.thumb-item.active,
.thumb-item:hover {
  opacity: 1;
  border-color: var(--primary);
}
.thumb-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.brand-tag {
  text-transform: uppercase;
  font-size: 0.8rem;
  font-weight: bold;
  letter-spacing: 1px;
  color: blue;
  font-weight: 900;
  font-style: italic;
  margin-bottom: 8px;
}
.p-title {
  font-family: var(--font-serif);
  font-size: 2.2rem;
  line-height: 1.2;
  margin: 0 0 15px;
  color: var(--text-main);
}

.p-rating {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.9rem;
  margin-bottom: 20px;
}
.stars {
  display: flex;
  color: #facc15;
}
.fill-star {
  fill: currentColor;
}
.p-rating .sep {
  color: var(--border);
}
.p-rating .sold {
  color: var(--text-gray);
}

.p-price {
  display: flex;
  align-items: baseline;
  gap: 12px;
  margin-bottom: 24px;
  padding: 16px;
  background: var(--bg-light);
  border-radius: 8px;
}
.curr-price {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--primary);
}
.old-price {
  font-size: 1.1rem;
  text-decoration: line-through;
  color: var(--text-gray);
}
.discount-tag {
  background: #fee2e2;
  color: #ef4444;
  font-size: 0.8rem;
  font-weight: 700;
  padding: 2px 6px;
  border-radius: 4px;
}

.p-desc-short {
  font-size: 1rem;
  line-height: 1.6;
  color: #4b5563;
  margin-bottom: 30px;
}

.action-box {
  display: flex;
  gap: 12px;
  margin-bottom: 30px;
  height: 50px;
}
.qty-control {
  display: flex;
  border: 1px solid var(--border);
  border-radius: 8px;
  overflow: hidden;
}
.qty-control button {
  width: 40px;
  border: none;
  background: #fff;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: 0.2s;
}
.qty-control button:hover {
  background: var(--bg-light);
}
.qty-control input {
  width: 40px;
  border: none;
  text-align: center;
  font-weight: 600;
  font-size: 1rem;
  outline: none;
}

.btn-add-cart {
  flex: 1;
  background: #ff6600;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  transition: 0.2s;
}
.btn-add-cart:hover {
  background: #cc6600;
  box-shadow: 0 4px 12px rgba(219, 39, 119, 0.3);
}

.btn-wish {
  width: 52px;
  height: 52px;
  border: 1.5px solid #e5e7eb;
  background: #fff;
  border-radius: 12px;
  cursor: pointer;
  color: #374151;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.25s ease;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.04);
}

.btn-wish:hover {
  border-color: #db2777;
  color: #db2777;
  transform: translateY(-1px);
  box-shadow: 0 6px 14px rgba(219, 39, 119, 0.15);
}

.btn-wish:active {
  transform: scale(0.94);
  box-shadow: 0 3px 6px rgba(219, 39, 119, 0.2);
}

.policies {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}
.policy-item {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.9rem;
  color: #4b5563;
}

.description-body {
  font-size: 1rem;
  line-height: 1.8;
  color: #374151;
  max-width: 800px;
}
.description-body p {
  margin-bottom: 16px;
}

.review-summary {
  display: flex;
  gap: 40px;
  background: #fff9fc;
  border: 1px solid #fce7f3;
  padding: 30px;
  border-radius: 12px;
  margin-bottom: 30px;
  align-items: center;
}
.score-box {
  text-align: center;
  min-width: 120px;
}
.big-score {
  font-size: 3rem;
  font-weight: 700;
  color: var(--primary);
  line-height: 1;
}
.total-count {
  font-size: 0.85rem;
  color: var(--text-gray);
  margin-top: 5px;
  display: block;
}

.filter-box {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
}
.filter-btn {
  padding: 8px 16px;
  border: 1px solid var(--border);
  background: #fff;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: 0.2s;
}
.filter-btn:hover,
.filter-btn.active {
  border-color: var(--primary);
  color: var(--primary);
  background: #fff;
}
.filter-btn.active {
  background: var(--primary);
  color: #fff;
}

.review-card {
  display: flex;
  gap: 16px;
  padding: 24px 0;
  border-bottom: 1px solid var(--bg-light);
}
.avatar-circle {
  width: 48px;
  height: 48px;
  background: #e5e7eb;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #6b7280;
  font-size: 1.2rem;
  flex-shrink: 0;
}
.review-content {
  flex: 1;
}
.r-header {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 4px;
}
.r-name {
  font-weight: 600;
  font-size: 0.95rem;
}
.verify-badge {
  display: flex;

  align-items: center;
  gap: 4px;
  font-size: 0.75rem;
  color: #10b981;
}
.r-stars {
  display: flex;
  gap: 2px;
  color: #facc15;
  font-size: 0.8rem;
  margin-bottom: 8px;
}
.gray-star {
  color: #e5e7eb;
  fill: currentColor;
}
.r-date {
  font-size: 0.8rem;
  color: var(--text-gray);
  margin-bottom: 12px;
}
.r-text {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #374151;
}

.load-more-wrap {
  text-align: center;
  margin-top: 30px;
}
.btn-outline {
  padding: 10px 30px;
  border: 1px solid black;
  background: #ff6600;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 600;
  transition: 0.2s;
}
.btn-outline:hover {
  background-color: #cc6600;
  color: white;
}

.related-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;
}
.product-item {
  cursor: pointer;
}
.img-wrap {
  position: relative;
  border-radius: 8px;
  overflow: hidden;
  margin-bottom: 12px;
  aspect-ratio: 3/4;
  background: var(--bg-light);
}
.img-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: 0.5s;
}
.product-item:hover .img-wrap img {
  transform: scale(1.08);
}
.overlay-btn {
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  background: rgba(255, 255, 255, 0.9);
  padding: 10px;
  text-align: center;
  font-weight: 600;
  transform: translateY(100%);
  transition: 0.3s;
  color: var(--text-main);
  font-size: 0.9rem;
}
.product-item:hover .overlay-btn {
  transform: translateY(0);
}

.p-brand {
  font-size: 0.75rem;
  color: var(--text-gray);
  text-transform: uppercase;
  margin-bottom: 4px;
}
.p-name {
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 6px;
  color: var(--text-main);
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
.p-price {
  font-weight: 700;
  color: var(--primary);
}
.fancy-title {
  text-align: center;
  font-style: oblique;
  margin: 60px 0 40px;
  letter-spacing: 0.6px;
  font-weight: 800;
  position: relative;
  font-size: 1.8rem;
}

/* Gạch dưới chạy animation */
.fancy-title::after {
  content: "";
  position: absolute;
  bottom: -10px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 3px;
  background: linear-gradient(90deg, #00ffff, #0080ff);
  border-radius: 2px;
  animation: titleUnderline 2s ease-out forwards;
  animation-delay: 0.4s;
}

@keyframes titleUnderline {
  to {
    width: 200px;
  }
}

/* Gradient chữ chạy */
.fancy-title span {
  background: linear-gradient(270deg, #ff0000, #00ff1e, #006eff, #7c00a6);
  background-size: 800% 800%;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  animation: gradientText 4s ease-in-out infinite;
}

@keyframes gradientText {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

/* --- RESPONSIVE --- */
.loading-view {
  min-height: 60vh;
  display: flex;
  align-items: center;
  justify-content: center;
}
.spinner {
  width: 40px;
  height: 40px;
  border: 3px solid var(--border);
  border-top-color: var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

@media (max-width: 900px) {
  .product-top-section {
    grid-template-columns: 1fr;
    gap: 30px;
  }
  .gallery-col {
    position: static;
  }
  .action-box {
    flex-wrap: wrap;
    height: auto;
  }
  .qty-control {
    height: 44px;
  }
  .btn-add-cart {
    height: 44px;
    width: 100%;
    order: 3;
    margin-top: 10px;
  }
  .btn-wish {
    height: 44px;
  }
  .related-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .review-summary {
    flex-direction: column;
    text-align: center;
    gap: 20px;
  }
}
.review-form {
  background: #fafafa;
  border: 1px solid #f0f0f0;
  border-radius: 8px;
  padding: 16px 20px;
  margin-bottom: 30px;
}

.fill-star {
  color: #facc15;
  fill: #facc15;
}

.gray-star {
  color: #d1d5db;
}

.rf-header {
  display: flex;
  align-items: center;
  gap: 6px;
  font-weight: 600;
  margin-bottom: 10px;
}

.rf-stars {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 12px;
  cursor: pointer;
}

.review-form textarea {
  width: 100%;
  height: 80px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  padding: 10px;
  font-size: 14px;
  resize: none;
}

.review-form textarea:focus {
  border-color: #ee4d2d;
}

.rf-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;
}

.btn-submit-review {
  background: #ee4d2d;
  color: #fff;
  border: none;
  padding: 6px 18px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
}

.btn-submit-review:hover {
  background: #d73211;
}
</style>
