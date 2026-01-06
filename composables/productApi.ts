export const productApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

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

  return {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
  };
};
