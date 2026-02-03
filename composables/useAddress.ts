import type { 
    Address, 
    CreateAddressPayload, 
    UpdateAddressPayload 
} from "@/@type/address";

export const useAddress = () => {
    const config = useRuntimeConfig();
    const baseURL = config.public.apiBaseUrl;
    const { getUserId } = useAuth();

    /**
     * Lấy danh sách địa chỉ của user
     */
    const getAllAddresses = async (): Promise<Address[]> => {
        try {
            const userId = getUserId.value;
            if (!userId) throw new Error("User not authenticated");

            const response: any = await $fetch(`${baseURL}/address/user/${userId}`, {
                method: "GET",
            });

            return response.data || [];
        } catch (error: any) {
            console.error("Get addresses error:", error);
            throw error;
        }
    };

    /**
     * Lấy chi tiết 1 địa chỉ
     */
    const getAddressById = async (addressId: number): Promise<Address> => {
        try {
            const userId = getUserId.value;
            if (!userId) throw new Error("User not authenticated");

            const response: any = await $fetch(
                `${baseURL}/address/${addressId}/user/${userId}`,
                {
                    method: "GET",
                }
            );

            return response.data;
        } catch (error: any) {
            console.error("Get address detail error:", error);
            throw error;
        }
    };

    /**
     * Tạo địa chỉ mới
     */
    const createAddress = async (data: Omit<CreateAddressPayload, 'user_id'>): Promise<Address> => {
        try {
            const userId = getUserId.value;
            if (!userId) throw new Error("User not authenticated");

            const payload: CreateAddressPayload = {
                ...data,
                user_id: userId,
            };

            const response: any = await $fetch(`${baseURL}/address/user/${userId}`, {
                method: "POST",
                body: payload,
            });

            return response.data;
        } catch (error: any) {
            console.error("Create address error:", error);
            throw error;
        }
    };

    /**
     * Cập nhật địa chỉ
     */
    const updateAddress = async (
        addressId: number,
        data: UpdateAddressPayload
    ): Promise<Address> => {
        try {
            const userId = getUserId.value;
            if (!userId) throw new Error("User not authenticated");

            const response: any = await $fetch(
                `${baseURL}/address/${addressId}/user/${userId}`,
                {
                    method: "PUT",
                    body: data,
                }
            );

            return response.data;
        } catch (error: any) {
            console.error("Update address error:", error);
            throw error;
        }
    };

    /**
     * Xóa địa chỉ
     */
    const deleteAddress = async (addressId: number): Promise<void> => {
        try {
            const userId = getUserId.value;
            if (!userId) throw new Error("User not authenticated");

            await $fetch(`${baseURL}/address/${addressId}/user/${userId}`, {
                method: "DELETE",
            });
        } catch (error: any) {
            console.error("Delete address error:", error);
            throw error;
        }
    };

    /**
     * Đặt làm địa chỉ mặc định
     */
    const setDefaultAddress = async (addressId: number): Promise<void> => {
        try {
            const userId = getUserId.value;
            if (!userId) throw new Error("User not authenticated");

            await $fetch(
                `${baseURL}/address/${addressId}/user/${userId}/default`,
                {
                    method: "PATCH",
                }
            );
        } catch (error: any) {
            console.error("Set default address error:", error);
            throw error;
        }
    };

    return {
        getAllAddresses,
        getAddressById,
        createAddress,
        updateAddress,
        deleteAddress,
        setDefaultAddress,
    };
};