import { combineReducers } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice"; // Importa o reducer do board

// Combina os reducers em um único rootReducer
const rootReducer = combineReducers({
  boards: boardReducer, // Junta o reducer de boards
});

export default rootReducer;
