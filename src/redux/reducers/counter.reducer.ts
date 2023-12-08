import { INCREMENT, DECREMENT } from '../type';
import { Action, CounterState } from '../../utils/interfaces/redux.interface';

const INITIAL_STATE: CounterState = {
  value: 0,
};

const counterReducer = (state = INITIAL_STATE, action: Action) => {
  switch (action.type) {
    case INCREMENT:
      return {
        ...state,
        value: state.value + 1,
      };

    case DECREMENT:
      return {
        ...state,
        value: state.value - 1,
      };

    default:
      return state;
  }
};

export default counterReducer;
