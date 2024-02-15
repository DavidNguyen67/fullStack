import instance from '../axios';
import * as constants from './../utils';

export const getAllUsersService = async (id = 'all', page) => {
  return await instance.get(
    `/${constants.crudUserPath}/${constants.readRoute}?${constants.queryPrefix.id}=${id}&${constants.queryPrefix.page}=${page}`
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
    `/${constants.crudUserPath}/${constants.deleteRoute}?${constants.queryPrefix.id}=${id}`
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
    `${constants.allCodePath}/${constants.readRoute}?${constants.queryPrefix.type}=${type}`
  );
};

export const getTopDoctorService = async () => {
  return await instance.get(
    `/${constants.crudDoctorPath}/${constants.readTopRoute}`
  );
};

export const getAllDoctorsService = async (id = 'all') => {
  return await instance.get(
    `/${constants.crudDoctorPath}/${constants.readRoute}?${constants.queryPrefix.id}=${id}`
  );
};

export const getDoctorDetail = async (id) => {
  return await instance.get(
    `/${constants.crudDoctorPath}/${constants.readDetailRoute}?${constants.queryPrefix.id}=${id}`
  );
};

export const updateDoctorService = async (payload) => {
  return await instance.put(
    `/${constants.crudDoctorPath}/${constants.updateRoute}`,
    payload
  );
};
export const updateMarkDownService = async (payload) => {
  return await instance.put(
    `/${constants.markdownPath}/${constants.updateRoute}`,
    payload
  );
};

export const createNewScheduleService = async (payload) => {
  return await instance.post(
    `/${constants.schedulePath}/${constants.createRoute}`,
    payload
  );
};

export const getWeekDaysSchedule = async (doctorId, date) => {
  return await instance.get(
    `/${constants.schedulePath}/${constants.readRoute}?${constants.queryPrefix.doctorId}=${doctorId}&${constants.queryPrefix.date}=${date}`
  );
};

export const createUpdateNewDoctorInfo = async (payload) => {
  return await instance.put(
    `/${constants.doctorInfo}/${constants.updateRoute}`,
    payload
  );
};

export const readProfileDoctor = async (id) => {
  return await instance.get(
    `/${constants.crudDoctorPath}/${constants.readCommonRoute}?${constants.queryPrefix.id}=${id}`
  );
};

export const createAppointment = async (payload) => {
  return await instance.post(
    `/${constants.bookingPath}/${constants.createRoute}`,
    payload
  );
};

export const verifyAppointment = async (tokenString) => {
  return instance.get(
    `/${constants.bookingPath}/${constants.verifyPath}?${constants.queryPrefix.token}=${tokenString}`
  );
};

export const createSpecialty = async (payload) => {
  return await instance.post(
    `/${constants.specialtyPath}/${constants.createRoute}`,
    payload
  );
};

export const readSpecialty = async (page) => {
  return await instance.get(
    `/${constants.specialtyPath}/${constants.readRoute}?${constants.queryPrefix.page}=${page}`
  );
};

export const deleteSpecialty = async (id) => {
  return await instance.delete(
    `/${constants.specialtyPath}/${constants.deleteRoute}?${constants.queryPrefix.id}=${id}`
  );
};

export const updateSpecialty = async (payload) => {
  return await instance.put(
    `/${constants.specialtyPath}/${constants.updateRoute}`,
    payload
  );
};

export const readClinic = async (page = 1) => {
  return await instance.get(
    `/${constants.clinicPath}/${constants.readRoute}?${constants.queryPrefix.page}=${page}`
  );
};

export const deleteClinic = async (id) => {
  return await instance.delete(
    `/${constants.clinicPath}/${constants.deleteRoute}?${constants.queryPrefix.id}=${id}`
  );
};

export const createClinic = async (payload) => {
  return await instance.post(
    `/${constants.clinicPath}/${constants.createRoute}`,
    payload
  );
};

export const updateClinic = async (payload) => {
  return await instance.put(
    `/${constants.clinicPath}/${constants.updateRoute}`,
    payload
  );
};

export const getSpecialtyDetail = async (id) => {
  return await instance.get(
    `/${constants.specialtyPath}/${constants.readDetailRoute}?${constants.queryPrefix.id}=${id}`
  );
};

export const getSpecialtyDetailFilterByProvince = async (
  clinicId,
  provinceId
) => {
  return await instance.get(
    `/${constants.specialtyPath}/${constants.readDetailRoute}?${constants.queryPrefix.id}=${clinicId}&${constants.queryPrefix.province}=${provinceId}`
  );
};

export const getClinicDetail = async (id) => {
  return await instance.get(
    `/${constants.clinicPath}/${constants.readDetailRoute}?${constants.queryPrefix.id}=${id}`
  );
};

export const getPatientByDayAndDoctorId = async (
  doctorId,
  date
  // access_token
) => {
  return await instance.get(
    `/${constants.bookingPath}/${constants.readRoute}?${constants.queryPrefix.doctorId}=${doctorId}&${constants.queryPrefix.date}=${date}`
    // {
    //   headers: { Authorization: `Bearer ${access_token}` },
    // }
  );
};

export const confirmRemedy = async (formData) => {
  return await instance.post(`/${constants.bookingPath}/upload`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
};