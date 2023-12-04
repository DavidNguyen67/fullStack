import {
  FILL_EMAIL_LOGIN,
  FILL_PASSWORD_LOGIN,
  LOGIN_ERROR,
  LOGIN_LOADING,
  LOGIN_SUCCESS,
} from '../types/index';

const INITIAL_STATE = {
  email: '',
  password: '',
  loading: false,
  error: '',
  data: {},
};

const authReducer = (state = INITIAL_STATE, action: any) => {
  switch (action.type) {
    case FILL_EMAIL_LOGIN:
      return {
        ...state,
        email: action.payload,
      };
    case FILL_PASSWORD_LOGIN:
      return {
        ...state,
        password: action.payload,
      };
    case LOGIN_LOADING: {
      return {
        ...state,
        loading: true,
        error: '',
      };
    }
    case LOGIN_SUCCESS: {
      return {
        ...state,
        data: action.data,
        loading: false,
      };
    }
    case LOGIN_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    default:
      return state;
  }
};

export default authReducer;
