// import axios from '../../utils/axios/customAxios';
// import { UPDATE_USER, CREATE_USER, DELETE_USER, READ_USER } from '../types';

import axios from '../../utils/axios/customAxios';
import {
  LOAD_USERS_ERROR,
  LOAD_USERS_LOADING,
  LOAD_USERS_SUCCESS,
  DELETE_USER_SUCCESS,
  DELETE_USER_ERROR,
  DELETE_USER_LOADING,
  SELECTED_USERS,
} from '../types';
// export const fetch = () => {
//   return {
//     type: READ_USER,
//   };
// };

export const selectedUser = (payload: number): object => {
  return {
    type: SELECTED_USERS,
    payload,
  };
};

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

export const loadUsers =
  (payload?: { page: 1; take: 5 }) => (dispatch: any) => {
    let queryString = `read?`;

    payload && (queryString += `page=${payload.page}&take=${payload.take}`);

    dispatch({ type: LOAD_USERS_LOADING });
    axios
      .get(queryString)
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

export const deleteUsers = (payload: number[]) => (dispatch: any) => {
  dispatch({ type: DELETE_USER_LOADING });
  axios
    .delete(`delete`, { data: payload })
    .then((response: any) => response)
    .then(
      (data) => {
        loadUsers({ page: 1, take: 5 });
        dispatch({ type: DELETE_USER_SUCCESS });
        // This must be modified dynamic param 'take'
      },
      (error) => {
        return dispatch({
          type: DELETE_USER_ERROR,
          error: error.message || 'Unexpected Error!!!',
        });
      }
    );
};
