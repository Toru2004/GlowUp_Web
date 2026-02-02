import { ref, computed, watch } from "vue";
import { useAuth } from "./useAuth";

export interface CartItem {
  id: number;
  cart_id: number;
  product_id: number;
  quantity: number;
  name: string;
  price: number;
  brand: string;
  images: string[];
  gender: string;
  description: string;
}

export interface Cart {
  user_id: number;
  cart_id: number;
  items: CartItem[];
  total_quantity: number;
  total_price: number;
}

export const useCart = () => {
  const { user, isAuthenticated } = useAuth();
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  const cart = useState<Cart | null>("cart_state", () => null);
  const loading = ref(false);

  const cartCount = computed(() => cart.value?.total_quantity || 0);

  const fetchCart = async () => {
    if (!isAuthenticated.value || !user.value?.userId) {
      cart.value = null;
      return;
    }

    loading.value = true;
    try {
      const res: any = await $fetch(`${baseURL}/carts/get-cart-by-user/${user.value.userId}`);
      cart.value = res;
    } catch (error) {
      console.error("Error fetching cart:", error);
      cart.value = null;
    } finally {
      loading.value = false;
    }
  };

  const addToCart = async (productId: number, quantity: number) => {
    if (!isAuthenticated.value || !user.value?.userId) {
      // Could redirect to login or show a toast
      navigateTo("/auth/login");
      return;
    }

    try {
      // Assuming we need cartId. If we don't have it, we might need to fetch it first or the API might handle userId.
      // Based on the curl provided: "cartId": 6. 
      // In this app, cartId often matches userId or is retrieved from fetchCart.
      
      if (!cart.value) {
        await fetchCart();
      }

      const cartId = cart.value?.cart_id || user.value.userId;

      await $fetch(`${baseURL}/carts/add-item`, {
        method: "POST",
        body: {
          cartId: cartId,
          productId: productId,
          quantity: quantity,
        },
      });

      // Refresh cart after adding
      await fetchCart();
    } catch (error) {
      console.error("Error adding to cart:", error);
      throw error;
    }
  };

  const updateQuantity = async (cartItemId: number, quantity: number) => {
    if (quantity < 1) return;
    try {
      await $fetch(`${baseURL}/carts/update-item-quantity/${cartItemId}`, {
        method: "PUT",
        body: {
          quantity: quantity,
        },
      });
      await fetchCart();
    } catch (error) {
      console.error("Error updating quantity:", error);
      throw error;
    }
  };

  const removeItem = async (cartItemId: number) => {
    try {
      await $fetch(`${baseURL}/carts/remove-item/${cartItemId}`, {
        method: "DELETE",
      });
      await fetchCart();
    } catch (error) {
      console.error("Error removing item:", error);
      throw error;
    }
  };

  const clearCart = async () => {
    if (!cart.value?.cart_id) return;
    try {
      await $fetch(`${baseURL}/carts/clear-all-cart-item/${cart.value.cart_id}`, {
        method: "DELETE",
      });
      await fetchCart();
    } catch (error) {
      console.error("Error clearing cart:", error);
      throw error;
    }
  };

  // Auto fetch when authenticated
  if (process.client) {
    watch(isAuthenticated, (val) => {
      if (val) {
        fetchCart();
      } else {
        cart.value = null;
      }
    }, { immediate: true });
  }

  return {
    cart,
    cartCount,
    loading,
    fetchCart,
    addToCart,
    updateQuantity,
    removeItem,
    clearCart,
  };
};
