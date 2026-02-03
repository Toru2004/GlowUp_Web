<template>
  <!-- Floating Button -->
  <button
    v-if="!open"
    @click="open = true"
    class="fixed bottom-6 right-6 w-14 h-14 rounded-full bg-blue-500 text-white shadow-lg flex items-center justify-center text-2xl hover:bg-blue-600 z-50"
  >
    💬
  </button>

  <!-- Chat Window -->
  <div
    v-if="open"
    class="fixed bottom-6 right-6 w-[360px] h-[520px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden z-50"
  >
    <!-- Header -->
    <div class="flex items-center justify-between px-4 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 text-white">
      <div class="flex items-center gap-2 font-semibold">
        🤖 Chatbot hỗ trợ
      </div>
      <button
        @click="open = false"
        class="text-white text-xl leading-none hover:opacity-80"
      >
        ×
      </button>
    </div>

    <!-- Messages -->
    <div
      ref="messageContainer"
      class="flex-1 overflow-y-auto px-4 py-3 space-y-4 bg-gray-50"
    >
      <div
        v-for="(msg, index) in messages"
        :key="index"
        class="space-y-2"
      >
        <!-- Bubble row -->
        <div
          class="flex items-end gap-2"
          :class="msg.role === 'user' ? 'justify-end' : 'justify-start'"
        >
          <!-- Bot avatar -->
          <div
            v-if="msg.role !== 'user'"
            class="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs"
          >
            🤖
          </div>

          <!-- Bubble -->
          <div
            class="max-w-[75%] px-3 py-2 text-sm leading-relaxed shadow"
            :class="msg.role === 'user'
              ? 'bg-blue-500 text-white rounded-2xl rounded-br-sm'
              : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm'"
          >
            {{ msg.content }}
          </div>

          <!-- User avatar -->
          <div
            v-if="msg.role === 'user'"
            class="w-7 h-7 rounded-full bg-gray-300 flex items-center justify-center text-xs"
          >
            👤
          </div>
        </div>

        <!-- Product cards -->
        <ProductCards
          v-if="msg.role === 'assistant' && msg.products?.length"
          :products="msg.products"
        />
      </div>

      <!-- Typing -->
      <div v-if="loading" class="flex items-center gap-2 text-gray-400 text-sm">
        <div class="w-7 h-7 rounded-full bg-indigo-500 text-white flex items-center justify-center text-xs">
          🤖
        </div>
        <span class="italic">Đang trả lời...</span>
      </div>
    </div>

    <!-- Input -->
    <form
      @submit.prevent="handleSend"
      class="p-3 border-t bg-white flex items-center gap-2"
    >
      <input
        v-model="input"
        type="text"
        placeholder="Nhập tin nhắn..."
        class="flex-1 px-3 py-2 rounded-full border text-sm focus:outline-none focus:ring focus:ring-blue-200"
      />
      <button
        type="submit"
        :disabled="loading || !input.trim()"
        class="px-4 py-2 rounded-full bg-blue-500 text-white text-sm disabled:opacity-50"
      >
        Gửi
      </button>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue';
import { useChatbot } from '@/composables/useChatbot';
import ProductCards from '@/components/Chatbot/ProductCards.vue';

const open = ref(false);
const input = ref('');
const messageContainer = ref<HTMLElement | null>(null);

const { messages, loading, sendMessage } = useChatbot();

const scrollToBottom = async () => {
  await nextTick();
  messageContainer.value?.scrollTo({
    top: messageContainer.value.scrollHeight,
    behavior: 'smooth',
  });
};

const handleSend = async () => {
  if (!input.value.trim() || loading.value) return;

  const userMessage = input.value;
  input.value = '';

  try {
    // ✅ CHỈ GỌI sendMessage
    await sendMessage(userMessage);
  } catch {
    messages.value.push({
      role: 'assistant',
      content: '❌ Có lỗi xảy ra, vui lòng thử lại.',
    });
  } finally {
    scrollToBottom();
  }
};

// ✅ chỉ watch độ dài là đủ
watch(
  () => messages.value.length,
  scrollToBottom
);
</script>


<style scoped>
::-webkit-scrollbar {
  width: 6px;
}
::-webkit-scrollbar-thumb {
  background: #c7d2fe;
  border-radius: 4px;
}
</style>
