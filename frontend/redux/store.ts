import { configureStore } from "@reduxjs/toolkit";
import boardReducer from "./boardSlice"; // Importa o reducer dos boards

// Configuração da store do Redux
const store = configureStore({
  reducer: {
    boards: boardReducer, // Adiciona o reducer dos boards
  },
});

// Tipagens úteis para serem usadas no projeto
export type RootState = ReturnType<typeof store.getState>; // Tipagem do estado da store
export type AppDispatch = typeof store.dispatch; // Tipagem do dispatch

export default store;
