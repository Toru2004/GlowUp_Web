import { ref, computed } from "vue";
import type { AuthUser } from "../@type/auth";

export const useAuth = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  const token = ref<string | null>(
    process.client ? localStorage.getItem("token") : null
  );
  const user = ref<AuthUser | null>(null);
  const isAuthenticated = computed(() => !!token.value);

  const login = async (data: { email: string; password: string }) => {
    const res: any = await $fetch(`${baseURL}/auth/login`, {
      method: "POST",
      body: data,
    });

    token.value = res.token;
    user.value = res.user || null;

    if (process.client) {
      localStorage.setItem("token", res.token);
    }

    return res;
  };
  const signup = async (data: {
    full_name: string;
    email: string;
    password: string;
  }) => {
    const res: any = await $fetch(`${baseURL}/auth/signup`, {
      method: "POST",
      body: data,
    });

    return res;
  };

  /* ================= LOGOUT ================= */
  const logout = () => {
    token.value = null;
    user.value = null;

    if (process.client) {
      localStorage.removeItem("token");
    }

    navigateTo("/login");
  };

  return {
    token,
    user,
    isAuthenticated,
    login,
    signup,
    logout,
  };
};
