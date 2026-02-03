import { ref } from "vue";

export const useVnpay = () => {
  const loading = ref(false);
  const error = ref<string | null>(null);

  const config = useRuntimeConfig();
  const apiBase = `${config.public.apiBaseUrl}/vnpay`;

  const createPayment = async (payload: {
    orderId: number;
    bankCode?: string;
  }) => {
    loading.value = true;
    error.value = null;
    console.log("API BASE =", config.public.apiBaseUrl);
console.log("FULL URL =", `${config.public.apiBaseUrl}/vnpay/create-payment`);

    try {
      const res: any = await $fetch(`${apiBase}/create-payment`, {
        method: "POST",
        body: payload,
      });

      // ✅ LẤY ĐÚNG paymentUrl
      const paymentUrl = res?.data?.paymentUrl;

      if (!paymentUrl) {
        throw new Error("Không nhận được URL thanh toán VNPay");
      }

      // 🚀 Redirect sang VNPay
      window.location.href = paymentUrl;
    } catch (err: any) {
      error.value = err?.data?.message || "Không thể tạo thanh toán";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    loading,
    error,
    createPayment,
  };
};
