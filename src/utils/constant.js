export const path = {
  HOME: '/',
  HOMEPAGE: '/home',
  LOGIN: '/login',
  LOG_OUT: '/logout',
  SYSTEM: '/system',
  DETAIL_DOCTOR: '/doctor/detail/:id',
  DOCTOR: '/doctor',
};

export const LANGUAGES = {
  VI: 'vi',
  EN: 'en',
};

export const manageActions = {
  ADD: 'ADD',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
};

export const AllCodeType = {
  GENDER: 'GENDER',
  ROLE: 'ROLE',
  POSITION: 'POSITION',
  TIME: 'TIME',
};

export const dateFormat = {
  SEND_TO_SERVER: 'DD/MM/YYYY',
};

export const YesNoObj = {
  YES: 'Y',
  NO: 'N',
};

export const USER_ROLE = {
  ADMIN: 'R1',
  DOCTOR: 'R2',
  PATIENT: 'R3',
};

// 20971520 byte = 20 MB
export const MAX_FILE_SIZE = 20971520;
export const MAX_NUMBER_OF_DOCTORS = 10;
export const PNG_PREFIX = 'data:image/png;base64,';

// Route api
export const GlobalPrefix = 'api';
export const versionApi = 'v1';

export const authPath = 'auth';
export const crudUserPath = 'user';
export const allCodePath = 'allCode';
export const crudDoctorPath = 'doctor';
export const schedulePath = 'schedule';
export const markdownPath = 'markdown';

export const loginRoute = 'login';
export const readRoute = 'read';
export const readDetailRoute = 'read/detail';
export const readTopRoute = 'top/read';
export const updateRoute = 'update';
export const deleteRoute = 'delete';
export const createRoute = 'create';

export const queryPrefixId = 'id';
export const queryPrefixType = 'type';
export const queryPrefixLimit = 'limit';
