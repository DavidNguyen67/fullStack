import {
  LOAD_USERS_ERROR,
  LOAD_USERS_LOADING,
  LOAD_USERS_SUCCESS,
} from '../types';

const initialState = {
  data: [],
  loading: false,
  error: '',
};
const CRUD_Reducers = (state = initialState, action: any) => {
  switch (action.type) {
    case LOAD_USERS_LOADING: {
      return {
        ...state,
        loading: true,
        error: '',
      };
    }
    case LOAD_USERS_SUCCESS: {
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    }
    case LOAD_USERS_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    default: {
      return state;
    }
  }
};

export default CRUD_Reducers;
