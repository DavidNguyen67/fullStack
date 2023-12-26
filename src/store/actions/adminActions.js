import { getAllCodeService } from '../../services/userService';
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
