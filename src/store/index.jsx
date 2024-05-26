import {legacy_createStore as createStore, combineReducers} from "redux";
import * as chat from "./chat/reducer";
import * as home from "./home/reducer";

let store = createStore(
    combineReducers({...chat, ...home})
);

export default store;
