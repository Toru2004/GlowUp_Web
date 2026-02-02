export const productApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;
  const loading = ref(false);
  const error = ref<string | null>(null);

  const getProducts = async () => {
    const res: any = await $fetch(`${baseURL}/products`);
    return res.data || res;
  };

  const getProductById = async (id: number | string) => {
    const res: any = await $fetch(`${baseURL}/products/${id}`);
    return res.data || res;
  };

  const createProduct = async (formData: FormData) => {
    const res: any = await $fetch(`${baseURL}/products/create`, {
      method: "POST",
      body: formData,
    });
    return res.data || res;
  };

  const updateProduct = async (id: number | string, payload: any) => {
    const res: any = await $fetch(`${baseURL}/products/update/${id}`, {
      method: "PUT",
      body: payload,
    });
    return res.data || res;
  };

  const deleteProduct = async (id: number | string) => {
    const res: any = await $fetch(`${baseURL}/products/delete/${id}`, {
      method: "DELETE",
    });
    return res.data || res;
  };

  const getProductsByCat = async (categoryId: number) => {
    return await $fetch<any[]>(`${baseURL}/products/category/${categoryId}`);
  };

  // Lấy sản phẩm chưa có danh mục
  const getUnassignedProducts = async () => {
    return await $fetch<any[]>(`${baseURL}/products/unassigned`);
  };

  // Gán danh sách sản phẩm vào danh mục
  const assignProducts = async (categoryId: number, productIds: number[]) => {
    loading.value = true;
    try {
      await $fetch(`${baseURL}/products/category/${categoryId}`, {
        method: "POST",
        body: { productIds },
      });
    } catch (err: any) {
      error.value = err.data?.message || "Không thể thêm sản phẩm";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Gỡ sản phẩm khỏi danh mục
  const removeProductFromCat = async (
    categoryId: number,
    productId: number
  ) => {
    try {
      await $fetch(`${baseURL}/products/category/${categoryId}/${productId}`, {
        method: "DELETE",
      });
    } catch (err: any) {
      error.value = err.data?.message || "Không thể gỡ sản phẩm";
      throw err;
    }
  };

  return {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    loading,
    error,
    getProductsByCat,
    getUnassignedProducts,
    assignProducts,
    removeProductFromCat,
  };
};
