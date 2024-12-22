// store.js
import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import authReducer from "./reducers/authReducers";
import profileReducer from "./reducers/profileReducers";


const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
