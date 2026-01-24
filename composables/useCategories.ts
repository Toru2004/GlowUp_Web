import { ref } from "vue";
import type { Category } from "../@type/category";
export const useCategory = () => {
  const categories = ref<Category[]>([]);
  const category = ref<Category | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);
  const config = useRuntimeConfig();
  const apiBase = `${config.public.apiBaseUrl}/categories`;

  const getAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      categories.value = await $fetch<Category[]>(apiBase);
    } catch (err: any) {
      error.value = err?.data?.message || "Không thể tải danh sách";
    } finally {
      loading.value = false;
    }
  };

  const getById = async (id: number) => {
    loading.value = true;
    try {
      category.value = await $fetch<Category>(`${apiBase}/${id}`);
    } catch {
      error.value = "Lỗi khi lấy chi tiết";
    } finally {
      loading.value = false;
    }
  };

  const create = async (payload: {
    name: string;
    description?: string;
    image?: File;
  }) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.description)
      formData.append("description", payload.description);
    if (payload.image) formData.append("image", payload.image);

    const res = await $fetch(apiBase, {
      method: "POST",
      body: formData,
    });

    await getAll();
    return res;
  };

  const update = async (
    id: number,
    payload: {
      name: string;
      description?: string;
      image?: File | null;
    }
  ) => {
    const formData = new FormData();
    formData.append("name", payload.name);
    if (payload.description)
      formData.append("description", payload.description);

    if (payload.image) {
      formData.append("image", payload.image);
    }

    const res = await $fetch(`${apiBase}/${id}`, {
      method: "PUT",
      body: formData,
    });

    await getAll();
    return res;
  };

  const remove = async (id: number) => {
    try {
      await $fetch(`${apiBase}/${id}`, { method: "DELETE" });
      categories.value = categories.value.filter((c) => c.id !== id);
    } catch (err: any) {
      throw err;
    }
  };

  return {
    categories,
    category,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    remove,
  };
};
