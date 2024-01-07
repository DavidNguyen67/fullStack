const actionTypes = Object.freeze({
  //app
  APP_START_UP_COMPLETE: 'APP_START_UP_COMPLETE',
  SET_CONTENT_OF_CONFIRM_MODAL: 'SET_CONTENT_OF_CONFIRM_MODAL',
  CHANGE_LANGUAGE: 'CHANGE_LANGUAGE',

  //user
  ADD_USER_SUCCESS: 'ADD_USER_SUCCESS',

  USER_LOGIN_SUCCESS: 'USER_LOGIN_SUCCESS',
  USER_LOGIN_FAIL: 'USER_LOGIN_FAIL',
  PROCESS_LOGOUT: 'PROCESS_LOGOUT',

  //admin
  FETCH_GENDER_START: 'FETCH_GENDER_START',
  FETCH_GENDER_SUCCESS: 'FETCH_GENDER_SUCCESS',
  FETCH_GENDER_FAILED: 'FETCH_GENDER_FAILED',

  FETCH_POSITION_START: 'FETCH_POSITION_START',
  FETCH_POSITION_SUCCESS: 'FETCH_POSITION_SUCCESS',
  FETCH_POSITION_FAILED: 'FETCH_POSITION_FAILED',

  FETCH_ROLE_START: 'FETCH_ROLE_START',
  FETCH_ROLE_SUCCESS: 'FETCH_ROLE_SUCCESS',
  FETCH_ROLE_FAILED: 'FETCH_ROLE_FAILED',

  FETCH_ALL_CODE_SCHEDULE_TIME_START: 'FETCH_ALL_CODE_SCHEDULE_TIME_START',
  FETCH_ALL_CODE_SCHEDULE_TIME_SUCCESS: 'FETCH_ALL_CODE_SCHEDULE_TIME_SUCCESS',
  FETCH_ALL_CODE_SCHEDULE_TIME_FAILED: 'FETCH_ALL_CODE_SCHEDULE_TIME_FAILED',

  CREATE_USER_START: 'CREATE_USER_START',
  CREATE_USER_SUCCESS: 'CREATE_USER_SUCCESS',
  CREATE_USER_FAILED: 'CREATE_USER_FAILED',

  READ_USER_START: 'READ_USER_START',
  READ_USER_SUCCESS: 'READ_USER_SUCCESS',
  READ_USER_FAILED: 'READ_USER_FAILED',

  UPDATE_USER_START: 'UPDATE_USER_START',
  UPDATE_USER_SUCCESS: 'UPDATE_USER_SUCCESS',
  UPDATE_USER_FAILED: 'UPDATE_USER_FAILED',

  DELETE_USER_START: 'DELETE_USER_START',
  DELETE_USER_SUCCESS: 'DELETE_USER_SUCCESS',
  DELETE_USER_FAILED: 'DELETE_USER_FAILED',

  READ_TOP_DOCTORS_START: 'READ_TOP_DOCTORS_START',
  READ_TOP_DOCTORS_SUCCESS: 'READ_TOP_DOCTORS_SUCCESS',
  READ_TOP_DOCTORS_FAILED: 'READ_TOP_DOCTORS_FAILED',

  READ_DOCTORS_START: 'READ_DOCTORS_START',
  READ_DOCTORS_SUCCESS: 'READ_DOCTORS_SUCCESS',
  READ_DOCTORS_FAILED: 'READ_DOCTORS_FAILED',

  UPDATE_DOCTOR_START: 'UPDATE_DOCTOR_START',
  UPDATE_DOCTOR_SUCCESS: 'UPDATE_DOCTOR_SUCCESS',
  UPDATE_DOCTOR_FAILED: 'UPDATE_DOCTOR_FAILED',
});

export default actionTypes;
