import { combineReducers } from 'redux';
import appReducer from './app/reducer';
import authReducer from './auth/reducer';
// COMBINED REDUCERS
const rootReducer = {
  app: appReducer,
  auth: authReducer,
};

export default combineReducers(rootReducer);
