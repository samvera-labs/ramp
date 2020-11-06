// counter.test.js
import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import rootReducer from '../reducers';
import thunk from 'redux-thunk';

// this is a handy function that I normally make available for all my tests
// that deal with connected components.
// you can provide initialState or the entire store that the ui is rendered with
export function renderWithRedux(
  ui,
  {
    initialState,
    store = createStore(rootReducer, initialState, applyMiddleware(thunk)),
  } = {},
  renderFn = render
) {
  const obj = {
    ...renderFn(<Provider store={store}>{ui}</Provider>),
    store,
  };
  obj.rerenderWithRedux = (el, nextState) => {
    if (nextState) {
      store.replaceReducer(() => nextState);
      store.dispatch({ type: '__TEST_ACTION_REPLACE_STATE__' });
      store.replaceReducer(reducer);
    }
    return renderWithRedux(el, { store }, obj.rerender);
  };
  return obj;
}
