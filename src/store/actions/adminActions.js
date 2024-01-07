import {
  createNewUserService,
  deleteUsersService,
  getAllCodeService,
  getAllDoctorsService,
  getAllUsersService,
  getTopDoctorService,
  updateDoctorService,
  updateUsersService,
} from '../../services/userService';
import actionTypes from './actionTypes';
import * as constant from './../../utils';

export const fetchGenderStart = () => {
  return async (dispatch, getState) => {
    const fetchGenderSuccess = (payload) => {
      return {
        type: actionTypes.FETCH_GENDER_SUCCESS,
        payload,
      };
    };
    const fetchGenderFailed = () => ({
      type: actionTypes.FETCH_GENDER_FAILED,
    });

    try {
      dispatch({ type: actionTypes.FETCH_GENDER_START });
      const response = await getAllCodeService(constant.AllCodeType.GENDER);
      if (response.data?.length > 0)
        dispatch(fetchGenderSuccess(response.data));
      else dispatch(fetchGenderFailed());
    } catch (error) {
      console.log(error);
      dispatch(fetchGenderFailed());
    }
  };
};

export const fetchRoleStart = () => {
  return async (dispatch, getState) => {
    const fetchRoleSuccess = (payload) => {
      return {
        type: actionTypes.FETCH_ROLE_SUCCESS,
        payload,
      };
    };
    const fetchRoleFailed = () => ({
      type: actionTypes.FETCH_ROLE_FAILED,
    });

    try {
      dispatch({ type: actionTypes.FETCH_ROLE_START });
      const response = await getAllCodeService(constant.AllCodeType.ROLE);
      if (response.data?.length > 0) dispatch(fetchRoleSuccess(response.data));
      else dispatch(fetchRoleFailed());
    } catch (error) {
      console.log(error);
      dispatch(fetchRoleFailed());
    }
  };
};

export const fetchPositionStart = () => {
  return async (dispatch, getState) => {
    const fetchPositionSuccess = (payload) => {
      return {
        type: actionTypes.FETCH_POSITION_SUCCESS,
        payload,
      };
    };
    const fetchPositionFailed = () => ({
      type: actionTypes.FETCH_POSITION_FAILED,
    });

    try {
      dispatch({ type: actionTypes.FETCH_POSITION_START });
      const response = await getAllCodeService(constant.AllCodeType.POSITION);
      if (response.data?.length > 0)
        dispatch(fetchPositionSuccess(response.data));
      else dispatch(fetchPositionFailed());
    } catch (error) {
      console.log(error);
      dispatch(fetchPositionFailed());
    }
  };
};

export const createNewUser = (payload) => {
  return async (dispatch, getState) => {
    const createNewUserSuccess = () => {
      return {
        type: actionTypes.CREATE_USER_SUCCESS,
      };
    };
    const createNewUserFailed = (payload) => ({
      type: actionTypes.CREATE_USER_FAILED,
      payload,
    });

    try {
      dispatch({ type: actionTypes.CREATE_USER_START });

      const response = await createNewUserService(payload);
      const isError =
        Math.floor(
          (response.status ||
            response.statusCode ||
            response.data.status ||
            response.data?.statusCode) / 100
        ) !== 2;
      if (isError) {
        const { statusCode, error, message } = response.data;
        dispatch(createNewUserFailed({ statusCode, error, message }));
      } else {
        dispatch(createNewUserSuccess());
        dispatch(readUsers());
      }
    } catch (error) {
      console.log(error);
      dispatch(createNewUserFailed());
    }
  };
};

export const updateUsers = (payload) => {
  return async (dispatch, getState) => {
    const updateUsersSuccess = () => {
      return {
        type: actionTypes.UPDATE_USER_SUCCESS,
      };
    };
    const updateUsersFailed = (payload) => ({
      type: actionTypes.UPDATE_USER_FAILED,
      payload,
    });

    try {
      dispatch({ type: actionTypes.UPDATE_USER_START });
      const response = await updateUsersService(payload);
      const isError =
        Math.floor(
          (response.status ||
            response.statusCode ||
            response.data.status ||
            response.data?.statusCode) / 100
        ) !== 2;
      if (isError) {
        dispatch(updateUsersFailed(response));
      } else {
        dispatch(updateUsersSuccess());
        dispatch(readUsers());
      }
    } catch (error) {
      console.log(error);
      dispatch(updateUsersFailed());
    }
  };
};

export const readUsers = (ids) => {
  return async (dispatch, getState) => {
    const readUsersSuccess = (payload) => {
      return {
        type: actionTypes.READ_USER_SUCCESS,
        payload,
      };
    };
    const readUsersFailed = () => ({
      type: actionTypes.READ_USER_FAILED,
    });

    try {
      dispatch({ type: actionTypes.READ_USER_START });
      const response = await getAllUsersService(ids);
      return response.data?.error
        ? dispatch(readUsersFailed())
        : dispatch(readUsersSuccess(response.data || response));
    } catch (error) {
      console.log(error);
      dispatch(readUsersFailed());
    }
  };
};

export const deleteUsers = (ids) => {
  return async (dispatch, getState) => {
    const deleteUsersFailed = () => ({
      type: actionTypes.DELETE_USER_FAILED,
    });

    const deleteUsersSuccess = () => ({
      type: actionTypes.DELETE_USER_SUCCESS,
    });
    try {
      dispatch({ type: actionTypes.DELETE_USER_START });
      const response = await deleteUsersService(ids);
      const isError =
        Math.floor(
          (response.status ||
            response.statusCode ||
            response.data.status ||
            response.data?.statusCode) / 100
        ) !== 2;

      if (isError) {
        dispatch(deleteUsersFailed());
      } else {
        dispatch(deleteUsersSuccess());
        dispatch(readUsers());
      }
    } catch (error) {
      console.log(error);
      dispatch(deleteUsersFailed());
    }
  };
};

export const readTopDoctors = (limit) => {
  return async (dispatch, getState) => {
    const readDoctorsSuccess = (payload) => {
      return {
        type: actionTypes.READ_TOP_DOCTORS_SUCCESS,
        payload,
      };
    };
    const readDoctorsFailed = () => ({
      type: actionTypes.READ_TOP_DOCTORS_FAILED,
    });

    try {
      dispatch({ type: actionTypes.READ_TOP_DOCTORS_START });
      const response = await getTopDoctorService(limit);
      return response.data?.error
        ? dispatch(readDoctorsFailed())
        : dispatch(readDoctorsSuccess(response.data || response));
    } catch (error) {
      console.log(error);
      dispatch(readDoctorsFailed());
    }
  };
};

export const readAllDoctors = () => {
  return async (dispatch, getState) => {
    const readDoctorsSuccess = (payload) => {
      return {
        type: actionTypes.READ_DOCTORS_SUCCESS,
        payload,
      };
    };
    const readDoctorsFailed = () => ({
      type: actionTypes.READ_DOCTORS_FAILED,
    });

    try {
      dispatch({ type: actionTypes.READ_DOCTORS_START });
      const response = await getAllDoctorsService();

      return response.data?.error
        ? dispatch(readDoctorsFailed())
        : dispatch(readDoctorsSuccess(response.data || response));
    } catch (error) {
      console.log(error);
      dispatch(readDoctorsFailed());
    }
  };
};

export const readDoctor = (id) => {
  return async (dispatch, getState) => {
    const readDoctorsSuccess = (payload) => {
      return {
        type: actionTypes.READ_DOCTORS_SUCCESS,
        payload,
      };
    };
    const readDoctorsFailed = () => ({
      type: actionTypes.READ_DOCTORS_FAILED,
    });

    try {
      dispatch({ type: actionTypes.READ_DOCTORS_START });
      const response = await getAllDoctorsService(id);

      return response.data?.error
        ? dispatch(readDoctorsFailed())
        : dispatch(readDoctorsSuccess(response.data || response));
    } catch (error) {
      console.log(error);
      dispatch(readDoctorsFailed());
    }
  };
};

export const updateDoctor = (payload) => {
  return async (dispatch, getState) => {
    const updateDoctorSuccess = () => {
      return {
        type: actionTypes.UPDATE_DOCTOR_SUCCESS,
      };
    };
    const updateDoctorFailed = (payload) => ({
      type: actionTypes.UPDATE_DOCTOR_FAILED,
      payload,
    });

    try {
      dispatch({ type: actionTypes.UPDATE_DOCTOR_START });
      const response = await updateDoctorService(payload);
      const isError =
        Math.floor(
          (response.status ||
            response.statusCode ||
            response.data.status ||
            response.data?.statusCode) / 100
        ) !== 2;
      if (isError) {
        dispatch(updateDoctorFailed(response));
      } else {
        dispatch(updateDoctorSuccess());
        dispatch(readAllDoctors());
      }
    } catch (error) {
      console.log(error);
      dispatch(updateDoctorFailed());
    }
  };
};

export const readAllScheduleHours = () => {
  return async (dispatch, getState) => {
    const readAllScheduleHoursSuccess = (payload) => {
      return {
        type: actionTypes.FETCH_ALL_CODE_SCHEDULE_TIME_SUCCESS,
        payload,
      };
    };
    const readAllScheduleHoursFailed = () => ({
      type: actionTypes.FETCH_ALL_CODE_SCHEDULE_TIME_FAILED,
    });

    try {
      dispatch({ type: actionTypes.FETCH_ALL_CODE_SCHEDULE_TIME_START });
      const response = await getAllCodeService(constant.AllCodeType.TIME);
      if (response.data?.length > 0)
        dispatch(readAllScheduleHoursSuccess(response.data));
      else dispatch(readAllScheduleHoursFailed());
    } catch (error) {
      console.log(error);
      dispatch(readAllScheduleHoursFailed());
    }
  };
};
