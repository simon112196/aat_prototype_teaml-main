import { combineReducers, createStore } from "@reduxjs/toolkit";
import userStore from "./userStore";
import tokenStore from "./tokenStore";


const reducers = combineReducers({
    user: userStore,
    token: tokenStore
});
const store = createStore(reducers);


export default store ;
