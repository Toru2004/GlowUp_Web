<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import ProductGallery from "@/components/product/ProductGallery.vue";
import ProductInfo from "@/components/product/ProductInfo.vue";
import ProductReviewSection from "@/components/product/ProductReviewSection.vue";
import RelatedProducts from "@/components/product/RelatedProducts.vue";

const route = useRoute();
const { isAuthenticated } = useAuth();
const { showNotification } = useNotification();
const { addToCart } = useCart();

// State
const product = ref<any>(null);
const relatedProducts = ref<any[]>([]);
const reviews = ref<any[]>([]);
const selectedImage = ref("");
const quantity = ref(1);
const loading = ref(true);
const addingToCart = ref(false);

const IMAGE_BASE_URL = "http://localhost:8081/uploads/products";

// Mock data
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

const newReview = ref({
  user: "Khách hàng",
  rating: 5,
  content: "",
});

// Event handlers
const handleAddToCart = async () => {
  if (!isAuthenticated.value) {
    navigateTo("/auth/login");
    return;
  }
  if (!product.value) return;
  addingToCart.value = true;
  try {
    await addToCart(product.value.id, quantity.value);
    showNotification("Thành công", "Đã thêm sản phẩm vào giỏ hàng!", "success");
  } catch (error) {
    console.error("Failed to add to cart:", error);
    showNotification("Lỗi", "Có lỗi xảy ra khi thêm vào giỏ hàng.", "error");
  } finally {
    addingToCart.value = false;
  }
};

const handleSubmitReview = () => {
  console.log("Submitting review:", newReview.value);
  showNotification("Cảm ơn", "Đánh giá của bạn đã được ghi nhận!", "success");
};

// API call
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
</script>

<template>
  <div class="min-h-screen bg-white pb-20">
    <!-- Loading -->
    <div v-if="loading" class="container mx-auto px-4 py-32 flex items-center justify-center">
      <div class="w-12 h-12 border-4 border-gray-200 border-t-glow-primary-600 rounded-full animate-spin"></div>
    </div>

    <!-- Product Detail -->
    <div v-else-if="product" class="container mx-auto px-4 py-8 max-w-7xl">
      <!-- Breadcrumbs -->
      <nav class="flex items-center gap-2 text-sm mb-8 text-gray-500">
        <NuxtLink to="/home" class="hover:text-glow-primary-600 transition-colors">Trang chủ</NuxtLink>
        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
        <NuxtLink to="/shop" class="hover:text-glow-primary-600 transition-colors">Cửa hàng</NuxtLink>
        <span class="w-1 h-1 rounded-full bg-gray-300"></span>
        <span class="text-gray-900 font-medium">{{ product.name }}</span>
      </nav>

      <!-- Product Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
        <ProductGallery 
          :images="product.images || []"
          v-model:selectedImage="selectedImage"
          :imageBaseUrl="IMAGE_BASE_URL"
        />

        <ProductInfo 
          :product="product"
          v-model:quantity="quantity"
          :addingToCart="addingToCart"
          :reviewsCount="reviews.length"
          @addToCart="handleAddToCart"
          @toggleWishlist="() => {}"
        />
      </div>

      <!-- Reviews Section -->
      <ProductReviewSection 
        :reviews="reviews"
        :newReview="newReview"
        @submitReview="handleSubmitReview"
      />

      <!-- Related Products -->
      <RelatedProducts 
        :products="relatedProducts"
        :imageBaseUrl="IMAGE_BASE_URL"
      />
    </div>
  </div>
</template>
