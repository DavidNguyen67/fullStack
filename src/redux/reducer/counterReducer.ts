import { DECREMENT, INCREMENT } from '../types/index';

const INITIAL_STATE = {
  count: 0,
};

const counterReducer = (
  state = INITIAL_STATE,
  action: { type: string; payload?: number }
) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        count: state.count + (action.payload || 1),
      };

    case DECREMENT:
      return {
        ...state,
        count: state.count - 1,
      };

    default:
      return state;
  }
};

export default counterReducer;
