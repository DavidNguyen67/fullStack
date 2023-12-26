import instance from '../axios';

export const getAllUsers = async (id = 'all') => {
  return await instance.get(`/user/read?id=${id}`);
};

export const createNewUser = async (payload) => {
  const response = await instance.post(`/user/create`, payload);
  return response;
};

export const deleteUsers = async (id) => {
  return await instance.delete(`/user/delete?id=${id}`);
};

export const updateUsers = async (payload) => {
  const response = await instance.put(`/user/update`, payload);
  return response;
};

export const handleLogin = async (username, password) => {
  return await instance.post('/auth/login', { username, password });
};

export const getAllCodeService = async (type) => {
  return await instance.get(`allCode/read?type=${type}`);
};
