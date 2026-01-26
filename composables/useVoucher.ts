import { ref } from "vue";
import type { Voucher } from "../@type/voucher";

export const useVoucher = () => {
  const vouchers = ref<Voucher[]>([]);
  const voucher = ref<Voucher | null>(null);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const config = useRuntimeConfig();
  const apiBase = `${config.public.apiBaseUrl}/vouchers`;

  const getAll = async () => {
    loading.value = true;
    error.value = null;
    try {
      vouchers.value = await $fetch<Voucher[]>(apiBase);
    } catch (err: any) {
      error.value = err?.data?.message || "Không thể tải danh sách khuyến mãi";
    } finally {
      loading.value = false;
    }
  };

  const getById = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      voucher.value = await $fetch<Voucher>(`${apiBase}/${id}`);
    } catch (err: any) {
      error.value = err?.data?.message || "Không tìm thấy khuyến mãi";
    } finally {
      loading.value = false;
    }
  };

  const create = async (data: Partial<Voucher>) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(apiBase, {
        method: "POST",
        body: data,
      });
    } catch (err: any) {
      error.value = err?.data?.message || "Tạo khuyến mãi thất bại";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const update = async (id: number, data: Partial<Voucher>) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`${apiBase}/${id}`, {
        method: "PUT",
        body: data,
      });
    } catch (err: any) {
      error.value = err?.data?.message || "Cập nhật thất bại";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateStatus = async (id: number, status: string) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`${apiBase}/${id}/status`, {
        method: "PATCH",
        body: { status },
      });
    } catch (err: any) {
      error.value = err?.data?.message || "Cập nhật trạng thái thất bại";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const remove = async (id: number) => {
    loading.value = true;
    error.value = null;
    try {
      await $fetch(`${apiBase}/${id}`, {
        method: "DELETE",
      });
    } catch (err: any) {
      error.value = err?.data?.message || "Xóa thất bại";
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    vouchers,
    voucher,
    loading,
    error,
    getAll,
    getById,
    create,
    update,
    updateStatus,
    remove,
  };
};
