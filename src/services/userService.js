import instance from '../axios';

export const getAllUsers = async (id = 'all') => {
  return await instance.get(`/get-all-users?id=${id}`);
};

export const createNewUser = async (payload) => {
  return await instance.post(`/create-new-users`, payload);
};

export const deleteUsers = async (id) => {
  return await instance.delete(`/delete-users?id=${id}`);
};

export const updateUsers = async (payload) => {
  console.log(payload);
  return;
  return await instance.put(`edit-users`, payload);
};

export const handleLogin = async (username, password) => {
  return await instance.post('login', { username, password });
};
