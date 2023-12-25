import instance from '../axios';

export const getAllUsers = async (id = 'all') => {
  return await instance.get(`/user/read?id=${id}`);
};

export const createNewUser = async (payload) => {
  return await instance.post(`/user/create`, payload);
};

export const deleteUsers = async (id) => {
  return await instance.delete(`/user/delete?id=${id}`);
};

export const updateUsers = async (payload) => {
  return await instance.put(`/user/update`, payload);
};

export const handleLogin = async (username, password) => {
  return await instance.post('/auth/login', { username, password });
};
