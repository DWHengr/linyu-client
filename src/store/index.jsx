import {legacy_createStore as createStore, combineReducers} from "redux";
import * as chart from "./chart/reducer";
import * as home from "./home/reducer";

let store = createStore(
    combineReducers({...chart, ...home})
);

export default store;
