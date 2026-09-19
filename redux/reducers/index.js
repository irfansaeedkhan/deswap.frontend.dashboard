import loginReducer from "./login";
import metamaskConnectionReducer from "./metamask";
import {combineReducers} from "redux";
import socketReducer from "./socket";

const rootReducer = combineReducers({
    login: loginReducer,
    metaMask: metamaskConnectionReducer,
    socket:socketReducer,
});

export default rootReducer;