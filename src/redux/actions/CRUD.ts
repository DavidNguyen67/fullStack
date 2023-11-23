// import axios from '../../utils/axios/customAxios';
// import { UPDATE_USER, CREATE_USER, DELETE_USER, READ_USER } from '../types';

import instance from '../../utils/axios/customAxios';
import {
  LOAD_USERS_ERROR,
  LOAD_USERS_LOADING,
  LOAD_USERS_SUCCESS,
} from '../types';
// export const fetch = () => {
//   return {
//     type: READ_USER,
//   };
// };

// // export const fillPasswordLogin = (): object => {
// //   return {
// //     type: FILL_PASSWORD_LOGIN,
// //     payload,
// //   };
// // };

// // export const login = (): object => {
// //   return {
// //     type: LOGIN,
// //   };
// // };

export const loadUsers = () => (dispatch: any) => {
  dispatch({ type: LOAD_USERS_LOADING });
  instance
    .get(`read?take=3&skip=2`)
    .then((response: any) => response)
    .then(
      (data) => dispatch({ type: LOAD_USERS_SUCCESS, data }),
      (error) => {
        return dispatch({
          type: LOAD_USERS_ERROR,
          error: error.message || 'Unexpected Error!!!',
        });
      }
    );
};
