/**
 * API Service Composable
 * Provides reusable HTTP methods with automatic token injection
 */

export const useApi = () => {
  const config = useRuntimeConfig();
  const baseURL = config.public.apiBaseUrl;

  const getUsers = async () => {
    const res: any = await $fetch(`${baseURL}/users`);
    return res.data || res;
  };

  const createUser = async (data: any) => {
    const res: any = await $fetch(`${baseURL}/users/create-user`, {
      method: "POST",
      body: data,
    });
    return res;
  };

  const updateUser = async (id: number, data: any) => {
    const res: any = await $fetch(`${baseURL}/users/update-user/${id}`, {
      method: "PUT",
      body: data,
    });
    return res;
  };

  const deleteUser = async (id: number) => {
    const res: any = await $fetch(`${baseURL}/users/delete-user/${id}`, {
      method: "DELETE",
    });
    return res;
  };

  return { getUsers, createUser, updateUser, deleteUser };
};
