import type { Store } from "@/@type/store";

export const useStore = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;
  const loading = ref(false);
  const error = ref<string | null>(null);
    const { token } = useAuth();
    const getAuthHeaders = (): HeadersInit => {
    if (token.value) {
      const token = localStorage.getItem("token");
      if (token) {
        return {
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return {};
  };


  // Lấy tất cả stores
  const getAllStores = async (): Promise<Store[]> => {
    loading.value = true;
    error.value = null;
    try {
      const res: any = await $fetch(`${baseURL}/store`);
      return res.data || res;
    } catch (err: any) {
      error.value = err.data?.message || "Không thể lấy danh sách cửa hàng";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Lấy store theo ID
  const getStoreById = async (storeId: number | string): Promise<Store> => {
    loading.value = true;
    error.value = null;
    try {
      const res: any = await $fetch(`${baseURL}/store/${storeId}`);
      return res.data || res;
    } catch (err: any) {
      error.value = err.data?.message || "Không thể lấy thông tin cửa hàng";
      throw err;
    } finally {
      loading.value = false;
    }
  };


  // Tạo store (Admin)
  const createStore = async (storeData: Partial<Store>): Promise<Store> => {
    loading.value = true;
    error.value = null;
    try {
      const token = useCookie("authToken").value;
      const res: any = await $fetch(`${baseURL}/store`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: storeData,
      });
      return res.data || res;
    } catch (err: any) {
      error.value = err.data?.message || "Không thể tạo cửa hàng";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Cập nhật store (Admin)
  const updateStore = async (
    storeId: number | string,
    storeData: Partial<Store>
  ): Promise<Store> => {
    loading.value = true;
    error.value = null;
    try {
      const token = useCookie("authToken").value;
      const res: any = await $fetch(`${baseURL}/store/${storeId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: storeData,
      });
      return res.data || res;
    } catch (err: any) {
      error.value = err.data?.message || "Không thể cập nhật cửa hàng";
      throw err;
    } finally {
      loading.value = false;
    }
  };
  const getMyStores = async (): Promise<Store[]> => {
  loading.value = true;
  error.value = null;
  try {
    const res: any = await $fetch(`${baseURL}/store/my-stores`, {
      headers: getAuthHeaders(),
    });
    return res.data || res;
  } catch (err: any) {
    error.value = err.data?.message || "Không thể lấy cửa hàng của bạn";
    throw err;
  } finally {
    loading.value = false;
  }
};

  return {
    loading,
    error,
    getAllStores,
    getStoreById,
    createStore,
    updateStore,
    getMyStores
  };
};