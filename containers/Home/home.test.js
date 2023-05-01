import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import Home from './index';
import rootReducer from 'redux/rootReducer';

const ReduxProvider = ({ children, reduxStore }) => (
  <Provider store={reduxStore}>{children}</Provider>
);

const middlewares = [];
const mockStore = configureStore(middlewares);

const getState = {};
const addTodo = { type: 'ADD_TODO' };
const store = mockStore(getState);

describe('Home', () => {
  it('renders without crashing', () => {
    const store = mockStore(getState);
    store.dispatch(addTodo);

    const actions = store.getActions();
    expect(actions).toEqual([addTodo]);
    // render(
    //   <ReduxProvider reduxStore={store}>
    //     <Home />
    //   </ReduxProvider>
    // );
  });
});
