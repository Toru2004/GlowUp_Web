import { computed } from "vue";
import type { AuthUser } from "../@type/auth";

export const useAuth = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  // GLOBAL STATE
  const token = useState<string | null>("auth_token", () => null);
  const user = useState<AuthUser | null>("auth_user", () => null);

  // INIT từ localStorage
  if (import.meta.client) {
    if (!token.value) {
      token.value = localStorage.getItem("token");
    }

    if (!user.value) {
      const savedUser = localStorage.getItem("user");
      if (savedUser) {
        user.value = JSON.parse(savedUser);
      }
    }
  }

  const isAuthenticated = computed(() => {
    return !!token.value && !!user.value;
  });

  //  LOGIN
  const login = async (data: { email: string; password: string }) => {
    const res: any = await $fetch(`${baseURL}/auth/login`, {
      method: "POST",
      body: data,
    });

    token.value = res.data.token;
    user.value = {
      userId: Number(res.data.userId),
      email: res.data.email,
      full_name: res.data.full_name,
      role: res.data.role,
    };

    if (import.meta.client && token.value) {
      localStorage.setItem("token", token.value);
      localStorage.setItem("user", JSON.stringify(user.value));
    }

    return res;
  };

  // SIGNUP
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

  // LOGOUT
  const logout = () => {
    token.value = null;
    user.value = null;

    if (import.meta.client) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }

    navigateTo("/auth/login");
  };
  const getUserId = computed(() => {
    return user.value?.userId ?? null;
  });

  const fetchMe = async () => {
    if (!token.value) return null;

    const { getMe } = useApi();
    const me = await getMe();

    user.value = me;

    if (import.meta.client) {
      localStorage.setItem("user", JSON.stringify(me));
    }

    return me;
  };

  return {
    token,
    user,
    isAuthenticated,
    getUserId,
    fetchMe,
    login,
    signup,
    logout,
  };
};
