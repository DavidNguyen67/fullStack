import instance from '../axios';
import * as constants from './../utils';

export const getAllUsersService = async (id = 'all') => {
  return await instance.get(
    `/${constants.crudUserPath}/${constants.readRoute}?${constants.queryPrefixId}=${id}`
  );
};

export const createNewUserService = async (payload, file) => {
  return await instance.post(
    `/${constants.crudUserPath}/${constants.createRoute}`,
    payload
  );
};

export const deleteUsersService = async (id) => {
  return await instance.delete(
    `/${constants.crudUserPath}/${constants.deleteRoute}?${constants.queryPrefixId}=${id}`
  );
};

export const updateUsersService = async (payload) => {
  return await instance.put(
    `/${constants.crudUserPath}/${constants.updateRoute}`,
    payload
  );
};

export const handleLoginService = async (username, password) => {
  return await instance.post(`/${constants.authPath}/${constants.loginRoute}`, {
    username,
    password,
  });
};

export const getAllCodeService = async (type) => {
  return await instance.get(
    `${constants.allCodePath}/${constants.readRoute}?${constants.queryPrefixType}=${type}`
  );
};

export const getTopDoctorService = async (limit) => {
  return await instance.get(
    `/${constants.crudDoctorPath}/${constants.readTopRoute}?${constants.queryPrefixLimit}=${limit}`
  );
};

export const getAllDoctorsService = async (id = 'all') => {
  return await instance.get(
    `/${constants.crudDoctorPath}/${constants.readRoute}?${constants.queryPrefixId}=${id}`
  );
};

export const getDoctorDetail = async (id) => {
  return await instance.get(
    `/${constants.crudDoctorPath}/${constants.readDetailRoute}?${constants.queryPrefixId}=${id}`
  );
};

export const updateDoctorService = async (payload) => {
  return await instance.put(
    `/${constants.crudDoctorPath}/${constants.updateRoute}`,
    payload
  );
};
