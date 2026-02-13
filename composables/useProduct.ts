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

  /**
   * Lấy sản phẩm ngẫu nhiên (cho related products)
   * @param limit - Số lượng sản phẩm cần lấy (default: 4)
   * @param excludeId - ID sản phẩm cần loại trừ (thường là sản phẩm hiện tại)
   */
  const getRandomProducts = async (limit: number = 4, excludeId?: number | string) => {
    try {
      const allProducts = await getProducts();
      
      // Lọc bỏ sản phẩm hiện tại nếu có
      let filteredProducts = allProducts;
      if (excludeId) {
        filteredProducts = allProducts.filter((p: any) => p.id !== Number(excludeId));
      }
      
      // Shuffle array và lấy số lượng cần thiết
      const shuffled = filteredProducts.sort(() => 0.5 - Math.random());
      return shuffled.slice(0, limit);
    } catch (err: any) {
      error.value = err.data?.message || "Không thể lấy sản phẩm";
      throw err;
    }
  };

  /**
   * Lấy sản phẩm liên quan (cùng category hoặc ngẫu nhiên)
   * @param productId - ID sản phẩm hiện tại
   * @param limit - Số lượng sản phẩm cần lấy
   */
  const getRelatedProducts = async (productId: number | string, limit: number = 4) => {
    try {
      // Lấy thông tin sản phẩm hiện tại
      const currentProduct = await getProductById(productId);
      
      // Nếu có category_id, ưu tiên lấy sản phẩm cùng category
      if (currentProduct.category_id) {
        const categoryProducts = await getProductsByCat(currentProduct.category_id);
        
        // Lọc bỏ sản phẩm hiện tại
        const filtered = categoryProducts.filter((p: any) => p.id !== Number(productId));
        
        // Nếu đủ sản phẩm trong category
        if (filtered.length >= limit) {
          return filtered.slice(0, limit);
        }
        
        // Nếu không đủ, lấy thêm sản phẩm ngẫu nhiên
        const randomProducts = await getRandomProducts(limit - filtered.length, productId);
        return [...filtered, ...randomProducts].slice(0, limit);
      }
      
      // Nếu không có category, lấy ngẫu nhiên
      return await getRandomProducts(limit, productId);
    } catch (err: any) {
      console.error('Error getting related products:', err);
      // Fallback to random products
      return await getRandomProducts(limit, productId);
    }
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
    getRandomProducts,
    getRelatedProducts,
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