import { ERROR_GENERATED_AT_HOME, FETCH_SLIDE_AT_HOME } from '../type';
import { Action, SlideState } from '../../utils/interfaces/redux.interface';

const INITIAL_STATE: SlideState = {
  error: null,
  slides: [],
};

const slideAtHomeReducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case FETCH_SLIDE_AT_HOME:
      return {
        slides: action.payload?.data,
        error: null,
      };

    case ERROR_GENERATED_AT_HOME:
      return {
        error: action.payload,
        slides: null,
      };

    default:
      return state;
  }
};

export default slideAtHomeReducer;
