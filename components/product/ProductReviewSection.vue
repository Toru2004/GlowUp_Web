<script setup lang="ts">
import { Star, User, CheckCircle2 } from "lucide-vue-next";

const props = defineProps<{
  reviews: any[];
  newReview: {
    user: string;
    rating: number;
    content: string;
  };
}>();

const emit = defineEmits<{
  submitReview: [];
}>();
</script>

<template>
  <div class="mb-20">
    <h2 class="font-serif text-3xl text-gray-900 mb-8 text-center lg:text-left">Đánh Giá</h2>

    <!-- Review Summary -->
    <div class="bg-gradient-to-br from-pink-50 via-white to-pink-50/50 border border-pink-100 rounded-3xl p-8 mb-8 shadow-sm">
      <div class="flex flex-col md:flex-row items-center gap-8">
        <div class="text-center min-w-[140px]">
          <div class="text-6xl font-bold text-glow-primary-600 mb-2">4.8</div>
          <div class="flex justify-center text-yellow-400 mb-2">
            <Star v-for="n in 5" :key="n" class="w-4 h-4 fill-current" />
          </div>
          <div class="text-sm text-gray-500 font-medium">{{ reviews.length }} đánh giá</div>
        </div>

        <div class="flex flex-wrap gap-2 justify-center md:justify-start">
          <button class="px-5 py-2.5 bg-glow-primary-600 text-white rounded-full text-sm font-semibold shadow-sm hover:shadow-md transition-all">
            Tất cả
          </button>
          <button class="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:border-glow-primary-400 hover:text-glow-primary-600 transition-all">
            5 Sao (120)
          </button>
          <button class="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:border-glow-primary-400 hover:text-glow-primary-600 transition-all">
            4 Sao (8)
          </button>
          <button class="px-5 py-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-full text-sm font-semibold hover:border-glow-primary-400 hover:text-glow-primary-600 transition-all">
            Có hình ảnh (56)
          </button>
        </div>
      </div>
    </div>

    <!-- Review Form -->
    <div class="bg-white border border-gray-200 rounded-3xl p-6 mb-8 shadow-sm">
      <div class="flex items-center gap-2 mb-4 font-semibold text-gray-900">
        <User class="w-5 h-5 text-gray-600" />
        <span>Viết đánh giá của bạn</span>
      </div>

      <div class="flex gap-2 mb-4">
        <Star
          v-for="n in 5"
          :key="n"
          @click="newReview.rating = n"
          :class="[
            'w-7 h-7 cursor-pointer transition-all',
            n <= newReview.rating ? 'text-yellow-400 fill-current scale-110' : 'text-gray-300 hover:text-yellow-200'
          ]"
        />
      </div>

      <textarea
        v-model="newReview.content"
        placeholder="Chia sẻ cảm nhận của bạn về sản phẩm..."
        class="w-full h-28 p-4 border-2 border-gray-200 rounded-2xl resize-none outline-none focus:ring-2 focus:ring-glow-primary-200 focus:border-glow-primary-400 transition-all mb-4 text-gray-700"
      ></textarea>

      <button 
        @click="emit('submitReview')"
        class="px-6 py-3 bg-gray-900 text-white rounded-xl font-semibold text-sm hover:bg-glow-primary-600 hover:shadow-lg transition-all active:scale-95"
      >
        Gửi đánh giá
      </button>
    </div>

    <!-- Review List -->
    <div class="space-y-6">
      <div v-for="review in reviews" :key="review.id" class="flex gap-4 pb-6 border-b border-gray-100 last:border-0">
        <div class="w-12 h-12 rounded-full bg-gradient-to-br from-glow-primary-100 to-purple-100 flex items-center justify-center font-bold text-glow-primary-700 flex-shrink-0 text-lg">
          {{ review.user.charAt(0) }}
        </div>
        <div class="flex-1">
          <div class="flex items-center gap-2 mb-1 flex-wrap">
            <span class="font-semibold text-gray-900">{{ review.user }}</span>
            <span v-if="review.verify" class="flex items-center gap-1 text-xs text-green-600 bg-green-50 px-2.5 py-1 rounded-full font-medium">
              <CheckCircle2 class="w-3.5 h-3.5" />
              Đã mua hàng
            </span>
          </div>
          <div class="flex text-yellow-400 mb-2">
            <Star
              v-for="n in 5"
              :key="n"
              :class="['w-3.5 h-3.5', n <= review.rating ? 'fill-current' : 'text-gray-300 fill-current']"
            />
          </div>
          <div class="text-xs text-gray-500 mb-3 font-medium">{{ review.date }} | Phân loại: 50ml</div>
          <p class="text-gray-700 leading-relaxed">{{ review.content }}</p>
        </div>
      </div>
    </div>

    <div class="text-center mt-10">
      <button class="px-8 py-3 bg-white border-2 border-gray-900 text-gray-900 rounded-xl font-bold hover:bg-gray-900 hover:text-white transition-all shadow-sm hover:shadow-md active:scale-95">
        Xem thêm đánh giá
      </button>
    </div>
  </div>
</template>
