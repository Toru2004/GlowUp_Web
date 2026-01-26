<script setup lang="ts">
import { ref, computed } from "vue";
import { Search, ShoppingBag, User, Menu, X, LogOut } from "lucide-vue-next";

const { user, isAuthenticated, logout } = useAuth();

const isMenuOpen = ref(false);
const toggleMenu = () => (isMenuOpen.value = !isMenuOpen.value);

const displayName = computed(() => {
  return user.value?.name || user.value?.email || "User";
});

const navLinks = [
  { name: "Trang Chủ", path: "/home" },
  { name: "Sản Phẩm", path: "/shop" },
  { name: "Giới Thiệu", path: "/about" },
  { name: "Liên Hệ", path: "/contact" },
  { name: "Admin", path: "/admin/dashboard" },
];
</script>

<template>
  <header
    class="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100"
  >
    <div class="container mx-auto px-4 md:px-6">
      <div class="flex items-center justify-between h-20">
        <!-- Logo -->
        <NuxtLink
          to="/"
          class="text-2xl font-serif font-bold text-gray-900 tracking-wide"
        >
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

        <!-- Auth Area -->
        <div class="hidden md:flex items-center gap-3">
          <!-- CHƯA LOGIN -->
          <template v-if="!isAuthenticated">
            <NuxtLink to="/auth/login" class="auth-login"> Đăng nhập </NuxtLink>
            <NuxtLink to="/auth/register" class="auth-register">
              Đăng ký
            </NuxtLink>
          </template>

          <!-- ĐÃ LOGIN -->
          <template v-else>
            <div
              class="flex items-center gap-2 text-sm font-medium text-gray-700"
            >
              <User class="w-4 h-4" />
              <span>Xin chào, {{ displayName }}</span>
            </div>
            <button @click="logout" class="auth-logout">
              <LogOut class="w-4 h-4" />
              Đăng xuất
            </button>
          </template>
        </div>

        <!-- Icons -->
        <div class="flex items-center gap-4 text-gray-600">
          <button class="hover:text-glow-primary-600 transition-colors">
            <Search class="w-5 h-5" />
          </button>

          <button
            class="relative hover:text-glow-primary-600 transition-colors"
          >
            <ShoppingBag class="w-5 h-5" />
            <span
              class="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-glow-primary-500 text-[10px] font-bold text-white"
            >
              0
            </span>
          </button>

          <!-- Mobile Menu -->
          <button
            @click="toggleMenu"
            class="md:hidden hover:text-glow-primary-600 transition-colors"
          >
            <Menu v-if="!isMenuOpen" class="w-6 h-6" />
            <X v-else class="w-6 h-6" />
          </button>
        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div
      v-show="isMenuOpen"
      class="md:hidden border-t border-gray-100 bg-white"
    >
      <nav class="flex flex-col p-4 gap-2">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.path"
          :to="link.path"
          class="py-3 text-base font-medium text-gray-600 hover:text-glow-primary-600 border-b border-gray-50 last:border-0"
          @click="isMenuOpen = false"
        >
          {{ link.name }}
        </NuxtLink>

        <!-- Mobile Auth -->
        <div class="pt-4">
          <template v-if="!isAuthenticated">
            <NuxtLink to="/auth/login" class="block auth-login mb-2">
              Đăng nhập
            </NuxtLink>
            <NuxtLink to="/auth/register" class="block auth-register">
              Đăng ký
            </NuxtLink>
          </template>

          <template v-else>
            <p class="text-sm text-gray-700 mb-2">
              Xin chào, <b>{{ displayName }}</b>
            </p>
            <button @click="logout" class="auth-logout w-full">
              Đăng xuất
            </button>
          </template>
        </div>
      </nav>
    </div>
  </header>
</template>

<style>
.auth-login {
  font-size: 0.875rem;
  font-weight: 600;
  color: #374151;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  transition: all 0.2s ease;
}

.auth-login:hover {
  color: #0b6fa3;
  background: rgba(11, 111, 163, 0.08);
}

.auth-register {
  font-size: 0.875rem;
  font-weight: 700;
  color: white;
  background: #0b6fa3;
  padding: 0.45rem 0.9rem;
  border-radius: 999px;
  transition: all 0.2s ease;
}

.auth-register:hover {
  background: #095c88;
  transform: translateY(-1px);
}

.auth-logout {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.45rem 0.75rem;
  border-radius: 999px;
  background: #fee2e2;
  color: #b91c1c;
  transition: all 0.2s ease;
}

.auth-logout:hover {
  background: #fecaca;
}
</style>
