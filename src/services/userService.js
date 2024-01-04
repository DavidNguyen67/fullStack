import instance from '../axios';

export const getAllUsersService = async (id = 'all') => {
  return await instance.get(`/user/read?id=${id}`);
};

export const createNewUserService = async (payload, file) => {
  const response = await instance.post(`/user/create`, payload);
  return response;
};

export const deleteUsersService = async (id) => {
  return await instance.delete(`/user/delete?id=${id}`);
};

export const updateUsersService = async (payload) => {
  const response = await instance.put(`/user/update`, payload);
  return response;
};

export const handleLoginService = async (username, password) => {
  return await instance.post('/auth/login', { username, password });
};

export const getAllCodeService = async (type) => {
  return await instance.get(`allCode/read?type=${type}`);
};

export const getTopDoctorService = async (limit) => {
  return await instance.get(`/doctor/read?limit=${limit}`);
};
