import {
  FILL_EMAIL_LOGIN,
  FILL_PASSWORD_LOGIN,
  LOGIN_ERROR,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
} from '../types';
import axios from '../../utils/axios/customAxios';

export const fillEmailLogin = (payload: string): object => {
  return {
    type: FILL_EMAIL_LOGIN,
    payload,
  };
};

export const fillPasswordLogin = (payload: string): object => {
  return {
    type: FILL_PASSWORD_LOGIN,
    payload,
  };
};

export const login = (payload: object) => (dispatch: any) => {
  dispatch({ type: LOGIN_LOADING });
  axios
    .post(`login`, { data: payload })
    .then((response: any) => response)
    .then(
      (data) => dispatch({ type: LOGIN_SUCCESS, data }),
      (error) => {
        return dispatch({
          type: LOGIN_ERROR,
          error: error.message || 'Unexpected Error!!!',
        });
      }
    );
};
