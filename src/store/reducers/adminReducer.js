import actionTypes from '../actions/actionTypes';

const initialState = {
  users: [],

  genders: [],
  roles: [],
  positions: [],
  isLoading: false,
  isError: false,

  isLoadingCreate: false,
  isErrorCreate: false,

  isLoadingRead: false,
  isErrorRead: false,

  isLoadingUpdate: false,
  isErrorUpdate: false,

  isLoadingDelete: false,
  isErrorDelete: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.FETCH_GENDER_FAILED:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case actionTypes.FETCH_GENDER_SUCCESS:
      return {
        ...state,
        genders: action.payload,
        isLoading: false,
        isError: false,
      };

    case actionTypes.FETCH_POSITION_START:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.FETCH_POSITION_FAILED:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case actionTypes.FETCH_POSITION_SUCCESS:
      return {
        ...state,
        positions: action.payload,
        isLoading: false,
        isError: false,
      };

    case actionTypes.FETCH_ROLE_START:
      return {
        ...state,
        isLoading: true,
      };
    case actionTypes.FETCH_ROLE_FAILED:
      return {
        ...state,
        isLoading: false,
        isError: true,
      };
    case actionTypes.FETCH_ROLE_SUCCESS:
      return {
        ...state,
        roles: action.payload,
        isLoading: false,
        isError: false,
      };

    default:
      break;
  }
  switch (action.type) {
    case actionTypes.CREATE_USER_START:
      return {
        ...state,
        isLoadingCreate: true,
      };
    case actionTypes.CREATE_USER_FAILED:
      return {
        ...state,
        isErrorCreate: true,
        isLoadingCreate: false,
      };
    case actionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        isLoading: false,
        isLoadingCreate: false,
      };

    case actionTypes.READ_USER_START:
      return {
        ...state,
        isLoadingRead: true,
      };
    case actionTypes.READ_USER_FAILED:
      return {
        ...state,
        isErrorRead: true,
        isLoadingRead: false,
      };
    case actionTypes.READ_USER_SUCCESS:
      return {
        ...state,
        isErrorRead: false,
        isLoadingRead: false,
        users: action.payload,
      };

    case actionTypes.UPDATE_USER_START:
      return {
        ...state,
        isLoadingUpdate: true,
      };
    case actionTypes.UPDATE_USER_FAILED:
      return {
        ...state,
        isErrorUpdate: true,
        isLoadingUpdate: false,
      };
    case actionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        isErrorUpdate: false,
        isLoadingUpdate: false,
      };

    case actionTypes.DELETE_USER_START:
      return {
        ...state,
        isLoadingDelete: true,
      };
    case actionTypes.DELETE_USER_FAILED:
      return {
        ...state,
        isErrorDelete: true,
        isLoadingDelete: false,
      };
    case actionTypes.DELETE_USER_SUCCESS:
      return {
        ...state,
        isErrorDelete: false,
        isLoadingDelete: false,
      };

    default:
      return state;
  }
};

export default appReducer;
