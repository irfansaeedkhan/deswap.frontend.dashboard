import { createStore, applyMiddleware, combineReducers, compose } from "redux";
import { HYDRATE, createWrapper } from "next-redux-wrapper";
import { thunk } from "redux-thunk";
import metamaskConnectionReducer from "../reducers/metamask";
import loginReducer from "../reducers/login";
import socketReducer from "../reducers/socket";

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production" && typeof window !== "undefined") {
    const composeEnhancers =
      window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
    return composeEnhancers(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const combinedReducer = combineReducers({
  metamaskConn: metamaskConnectionReducer,
  userlog: loginReducer,
  socket: socketReducer,
});

const reducer = (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state,
      ...action.payload,
    };
    if (state.metamaskConn) nextState.metamaskConn = state.metamaskConn;
    if (state.userlog) nextState.userlog = state.userlog;
    if (state.socket) nextState.socket = state.socket;
    return nextState;
  }
  return combinedReducer(state, action);
};

const initStore = () => {
  try {
    return createStore(reducer, bindMiddleware([thunk]));
  } catch (e) {
    console.error("Create store:", e);
    return createStore(reducer, applyMiddleware(thunk));
  }
};

export const wrapper = createWrapper(initStore);
