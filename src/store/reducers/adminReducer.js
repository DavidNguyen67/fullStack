import actionTypes from '../actions/actionTypes';

const initialState = {
  genders: [],
  roles: [],
  positions: [],
  isLoading: true,
  isError: false,
};

const appReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.FETCH_GENDER_START:
      console.log('It start');
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
      return state;
  }
};

export default appReducer;
