// store.js
import { createStore, combineReducers, applyMiddleware } from "redux";
import {thunk} from "redux-thunk";
import authReducer from "./reducers/authReducers";
import profileReducer from "./reducers/profileReducers";
import doctorTypeReducer from "./reducers/doctorTypeReducers";
import doctorReducer from "./reducers/doctorReducers";

const rootReducer = combineReducers({
  auth: authReducer,
  profile: profileReducer,
  doctorTypes: doctorTypeReducer,
  doctors: doctorReducer,
  
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
