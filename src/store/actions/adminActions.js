import { toast } from 'react-toastify';
import {
  createNewUserService,
  deleteUsersService,
  getAllCodeService,
  getAllUsersService,
  updateUsersService,
} from '../../services/userService';
import actionTypes from './actionTypes';

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
      const response = await getAllCodeService('GENDER');
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
      const response = await getAllCodeService('ROLE');
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
      const response = await getAllCodeService('POSITION');
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
            response.data.statusCode) / 100
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
    const updateUsersFailed = () => ({
      type: actionTypes.UPDATE_USER_FAILED,
    });

    try {
      dispatch({ type: actionTypes.UPDATE_USER_START });
      const response = await updateUsersService(payload);
      const isError =
        Math.floor(
          (response.status ||
            response.statusCode ||
            response.data.status ||
            response.data.statusCode) / 100
        ) !== 2;
      if (isError) {
        dispatch(updateUsersFailed());
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
            response.data.statusCode) / 100
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
