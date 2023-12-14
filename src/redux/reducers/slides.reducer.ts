import { ERROR_GENERATED, FETCH_SLIDE } from '../type';
import { Action, SlideState } from '../../utils/interfaces/redux.interface';

const INITIAL_STATE: SlideState = {
  error: null,
  slides: [],
};

const slidesReducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case FETCH_SLIDE:
      return {
        slides: action.payload?.data,
        error: null,
      };

    case ERROR_GENERATED:
      return {
        error: action.payload,
        slides: null,
      };

    default:
      return state;
  }
};

export default slidesReducer;
