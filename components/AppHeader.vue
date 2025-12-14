<script setup lang="ts">
import { Search, ShoppingBag, User, Menu, X } from 'lucide-vue-next';

const isMenuOpen = ref(false);

const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
};

const navLinks = [
  { name: 'Trang Chủ', path: '/home' },
  { name: 'Sản Phẩm', path: '/shop' },
  { name: 'Giới Thiệu', path: '/about' },
  { name: 'Liên Hệ', path: '/contact' },
];
</script>

<template>
  <header class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
    <div class="container mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink to="/" class="text-2xl font-serif font-bold text-gray-900 tracking-wide">
          GlowUp<span class="text-glow-primary-500">.</span>
        </NuxtLink>

        <!-- Desktop Navigation -->
        <nav class="hidden md:flex items-center gap-8">
          <NuxtLink 
            v-for="link in navLinks" 
            :key="link.path" 
            :to="link.path"
            class="text-sm font-medium text-gray-600 hover:text-glow-primary-600 transition-colors uppercase tracking-wider"
            active-class="text-glow-primary-600"
          >
            {{ link.name }}
          </NuxtLink>
        </nav>

        <!-- Icons -->
        <div class="flex items-center gap-4 text-gray-600">
          <button class="hover:text-glow-primary-600 transition-colors">
            <Search class="w-5 h-5" />
          </button>
          <button class="hover:text-glow-primary-600 transition-colors">
            <User class="w-5 h-5" />
          </button>
          <button class="relative hover:text-glow-primary-600 transition-colors">
            <ShoppingBag class="w-5 h-5" />
            <span class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-glow-primary-500 text-[10px] font-bold text-white">0</span>
          </button>
          
          <!-- Mobile Menu Button -->
          <button @click="toggleMenu" class="md:hidden hover:text-glow-primary-600 transition-colors">
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-show="isMenuOpen" class="md:hidden border-t border-gray-100 bg-white">
      <nav class="flex flex-col p-4">
        <NuxtLink 
          v-for="link in navLinks" 
          :key="link.path" 
          :to="link.path"
          class="py-3 text-base font-medium text-gray-600 hover:text-glow-primary-600 border-b border-gray-50 last:border-0"
          active-class="text-glow-primary-600"
          @click="isMenuOpen = false"
        >
          {{ link.name }}
        </NuxtLink>
      </nav>
    </div>
  </header>
</template>
