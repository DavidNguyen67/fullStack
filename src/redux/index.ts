import { applyMiddleware, legacy_createStore as createStore } from 'redux';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';
import { combineReducers } from 'redux';
import locatesReducer from './reducers/locates.reducer';
import counterReducer from './reducers/counter.reducer';
import { thunk } from 'redux-thunk';
import slidesReducer from './reducers/slides.reducer';
import slideAtHomeReducer from './reducers/slideAtHome.reducer';
import('@formatjs/intl-locale/polyfill');
// import '@formatjs/intl-locale/vn';
type RootState = ReturnType<typeof store.getState>;
type AppDispatch = typeof store.dispatch;

const rootReducer = combineReducers({
  counter: counterReducer,
  locate: locatesReducer,
  // theme: themeReducer,
  slide: slidesReducer,
  slideAtHome: slideAtHomeReducer,
});
const store = createStore(rootReducer, applyMiddleware(thunk));

export type keyRootReducers = ReturnType<typeof rootReducer>;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export default store;
