// redux/root.ts
import { combineReducers } from "@reduxjs/toolkit";
import formularioReducer from "./formularioSlice";
import boardReducer from "./boardSlice";

const rootReducer = combineReducers({
  formulario: formularioReducer,
  boards: boardReducer,
});

export default rootReducer;
