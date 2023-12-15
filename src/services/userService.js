import instance from '../axios';

export const getAllUsers = (id = 'all') => {
  return instance.get(`/get-all-users?id=${id}`);
};
export const handleLogin = async (username, password) => {
  return await instance.post('login', { username, password });
};
