import { DELETE_USER_ERROR, SELECTED_USERS } from '../types/index';
import {
  DELETE_USER_LOADING,
  DELETE_USER_SUCCESS,
  LOAD_USERS_ERROR,
  LOAD_USERS_LOADING,
  LOAD_USERS_SUCCESS,
  LOAD_USER_ERROR,
  LOAD_USER_LOADING,
  LOAD_USER_SUCCESS,
} from '../types';

const initialState: {
  data: any[];
  loading: boolean;
  error: any;
  selected: number[];
  dataUser: any;
} = {
  data: [],
  loading: false,
  error: '',
  selected: [],
  dataUser: {},
};
const CRUD_Reducers = (state = initialState, action: any) => {
  switch (action.type) {
    case SELECTED_USERS: {
      return {
        ...state,
        selected: state.selected.includes(action.payload)
          ? state.selected.filter((select) => select !== action.payload)
          : [...state.selected, action.payload],
      };
    }
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
    case LOAD_USER_LOADING: {
      return {
        ...state,
        loading: true,
        error: '',
      };
    }
    case LOAD_USER_SUCCESS: {
      return {
        ...state,
        dataUser: action.data,
        loading: false,
      };
    }
    case LOAD_USER_ERROR: {
      return {
        ...state,
        loading: false,
        error: action.error,
      };
    }
    case DELETE_USER_LOADING: {
      return {
        ...state,
        loading: true,
        error: '',
      };
    }
    case DELETE_USER_SUCCESS: {
      return {
        ...state,
        loading: false,
        selected: [],
      };
    }
    case DELETE_USER_ERROR: {
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
