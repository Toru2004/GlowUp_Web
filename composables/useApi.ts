/**
 * API Service Composable
 * Provides reusable HTTP methods with automatic token injection
 */

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  const getAuthHeaders = (): HeadersInit => {
    if (process.client) {
      const token = localStorage.getItem("token");
      if (token) {
        return {
          Authorization: `Bearer ${token}`,
        };
      }
    }
    return {};
  };

  const getUsers = async () => {
    const res: any = await $fetch(`${baseURL}/users`, {
      headers: getAuthHeaders(),
    });
    return res.data || res;
  };

  const createUser = async (data: any) => {
    return await $fetch(`${baseURL}/users/create-user`, {
      method: "POST",
      body: data,
      headers: getAuthHeaders(),
    });
  };

  const updateUser = async (id: number, data: any) => {
    return await $fetch(`${baseURL}/users/update-user/${id}`, {
      method: "PUT",
      body: data,
      headers: getAuthHeaders(),
    });
  };

  const deleteUser = async (id: number) => {
    return await $fetch(`${baseURL}/users/delete-user/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
  };

  return { getUsers, createUser, updateUser, deleteUser };
};
