import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import thunkMiddleware from 'redux-thunk';
import reducers from './rootReducer';

// CREATING INITIAL STORE
export default function getStore(initialState) {
  const store = createStore(
    reducers,
    initialState,
    composeWithDevTools(applyMiddleware(thunkMiddleware))
  );

  // IF REDUCERS WERE CHANGED, RELOAD WITH INITIAL STATE
  if (module.hot) {
    module.hot.accept('./rootReducer', () => {
      const createNextReducer = require('./rootReducer').default;

      store.replaceReducer(createNextReducer(initialState));
    });
  }

  return store;
}
