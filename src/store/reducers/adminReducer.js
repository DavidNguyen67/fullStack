import actionTypes from '../actions/actionTypes';

const initialState = {
  users: [],
  topDoctors: [],
  doctors: [],

  statusCode: null,
  message: null,

  genders: [],
  roles: [],
  positions: [],
  isLoading: false,
  isError: false,
  isSuccess: false,

  isLoadingCreate: false,
  isErrorCreate: false,
  isSuccessCreate: false,

  isLoadingRead: false,
  isErrorRead: false,
  isSuccessRead: false,

  isLoadingUpdate: false,
  isErrorUpdate: false,
  isSuccessUpdate: false,

  isLoadingDelete: false,
  isErrorDelete: false,
  isSuccessDelete: false,

  isLoadingReadDoctor: false,
  isErrorReadDoctor: false,
  isSuccessReadDoctor: false,

  isLoadingReadTopDoctor: false,
  isErrorReadTopDoctor: false,
  isSuccessReadTopDoctor: false,

  isLoadingUpdateDoctor: false,
  isErrorUpdateDoctor: false,
  isSuccessUpdateDoctor: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      return {
        ...state,
        isSuccess: false,
        isLoading: true,
        isError: false,
      };
    case actionTypes.FETCH_GENDER_FAILED:
      return {
        ...state,
        isSuccess: false,
        isLoading: false,
        isError: true,
      };
    case actionTypes.FETCH_GENDER_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        genders: action.payload,
        isLoading: false,
        isError: false,
      };

    case actionTypes.FETCH_POSITION_START:
      return {
        ...state,
        isSuccess: false,
        isLoading: true,
        isError: false,
      };
    case actionTypes.FETCH_POSITION_FAILED:
      return {
        ...state,
        isSuccess: false,
        isLoading: false,
        isError: true,
      };
    case actionTypes.FETCH_POSITION_SUCCESS:
      return {
        ...state,
        isSuccess: true,
        positions: action.payload,
        isLoading: false,
        isError: false,
      };

    case actionTypes.FETCH_ROLE_START:
      return {
        ...state,
        isSuccess: false,
        isLoading: true,
        isError: false,
      };
    case actionTypes.FETCH_ROLE_FAILED:
      return {
        ...state,
        isSuccess: false,
        isLoading: false,
        isError: true,
      };
    case actionTypes.FETCH_ROLE_SUCCESS:
      return {
        ...state,
        isSuccess: true,
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
        isErrorCreate: false,
        // isSuccessCreate: false,
      };
    case actionTypes.CREATE_USER_FAILED:
      return {
        ...state,
        isSuccessCreate: false,
        isErrorCreate: true,
        isLoadingCreate: false,
        statusCode: action.payload?.statusCode,
        message: action.payload?.message,
      };
    case actionTypes.CREATE_USER_SUCCESS:
      return {
        ...state,
        isErrorCreate: false,
        isLoadingCreate: false,
        statusCode: null,
        message: null,
        isSuccessCreate: true,
      };

    case actionTypes.READ_USER_START:
      return {
        ...state,
        isLoadingRead: true,
        isErrorRead: false,
        isSuccessRead: false,
      };
    case actionTypes.READ_USER_FAILED:
      return {
        ...state,
        isErrorRead: true,
        isLoadingRead: false,
        isSuccessRead: false,
      };
    case actionTypes.READ_USER_SUCCESS:
      return {
        ...state,
        isErrorRead: false,
        isLoadingRead: false,
        users: action.payload,
        statusCode: null,
        message: null,
        isSuccessRead: true,
      };

    case actionTypes.UPDATE_USER_START:
      return {
        ...state,
        isLoadingUpdate: true,
        isErrorUpdate: false,
        isSuccessUpdate: false,
        message: null,
      };
    case actionTypes.UPDATE_USER_FAILED:
      return {
        ...state,
        isErrorUpdate: true,
        isLoadingUpdate: false,
        isSuccessUpdate: false,
        message: action.payload,
      };
    case actionTypes.UPDATE_USER_SUCCESS:
      return {
        ...state,
        isErrorUpdate: false,
        isLoadingUpdate: false,
        statusCode: null,
        message: null,
        isSuccessUpdate: true,
      };

    case actionTypes.DELETE_USER_START:
      return {
        ...state,
        isLoadingDelete: true,
        isErrorDelete: false,
        isSuccessDelete: false,
      };
    case actionTypes.DELETE_USER_FAILED:
      return {
        ...state,
        isErrorDelete: true,
        isLoadingDelete: false,
        isSuccessDelete: false,
      };
    case actionTypes.DELETE_USER_SUCCESS:
      return {
        ...state,
        isErrorDelete: false,
        isLoadingDelete: false,
        statusCode: null,
        message: null,
        isSuccessDelete: true,
      };

    default:
      break;
  }

  switch (action.type) {
    case actionTypes.READ_TOP_DOCTORS_START:
      return {
        ...state,
        isLoadingReadTopDoctor: true,
        isErrorReadTopDoctor: false,
        isSuccessReadTopDoctor: false,
      };
    case actionTypes.READ_TOP_DOCTORS_FAILED:
      return {
        ...state,
        isErrorReadTopDoctor: true,
        isLoadingReadTopDoctor: false,
        isSuccessReadTopDoctor: false,
      };
    case actionTypes.READ_TOP_DOCTORS_SUCCESS:
      console.log('====================================');
      console.log(action.payload);
      console.log('====================================');
      return {
        ...state,
        isErrorReadTopDoctor: false,
        isLoadingReadTopDoctor: false,
        topDoctors: action.payload,
        statusCode: null,
        message: null,
        isSuccessReadTopDoctor: true,
      };

    case actionTypes.READ_DOCTORS_START:
      return {
        ...state,
        isLoadingReadDoctor: true,
        isErrorReadDoctor: false,
        isSuccessReadDoctor: false,
      };
    case actionTypes.READ_DOCTORS_FAILED:
      return {
        ...state,
        isErrorReadDoctor: true,
        isLoadingReadDoctor: false,
        isSuccessReadDoctor: false,
      };
    case actionTypes.READ_DOCTORS_SUCCESS:
      return {
        ...state,
        isErrorReadDoctor: false,
        isLoadingReadDoctor: false,
        doctors: action.payload,
        statusCode: null,
        message: null,
        isSuccessReadDoctor: true,
      };

    case actionTypes.UPDATE_DOCTOR_START:
      return {
        ...state,
        isLoadingUpdateDoctor: true,
        isErrorUpdateDoctor: false,
        isSuccessUpdateDoctor: false,
        message: null,
      };
    case actionTypes.UPDATE_DOCTOR_FAILED:
      return {
        ...state,
        isErrorUpdateDoctor: true,
        isLoadingUpdateDoctor: false,
        isSuccessUpdateDoctor: false,
        message: action.payload,
      };
    case actionTypes.UPDATE_DOCTOR_SUCCESS:
      return {
        ...state,
        isErrorUpdateDoctor: false,
        isLoadingUpdateDoctor: false,
        statusCode: null,
        message: null,
        isSuccessUpdateDoctor: true,
      };

    default:
      break;
  }
  return state;
};

export default appReducer;
