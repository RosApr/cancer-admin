import { combineReducers, applyMiddleware, createStore } from 'redux';
import thunk from 'redux-thunk';
import doctor from '@/redux/reducers/doctor';
import service from '@/redux/reducers/service';
import office from '@/redux/reducers/office';

const middlewares = [thunk];

if (process.env.NODE_ENV === 'development') {
  middlewares.push(require('redux-logger').createLogger());
}
const store = combineReducers({
  doctor,
  service,
  office,
});

export default createStore(store, applyMiddleware(...middlewares));
