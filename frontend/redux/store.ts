import { configureStore } from "@reduxjs/toolkit";
import rootReducer from "./root"; // Isso já contém todos os reducers combinados

export const store = configureStore({
  reducer: rootReducer, // Usa o rootReducer diretamente
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, // Desabilita a verificação de serializabilidade para lidar com arquivos
    }),
});

export type RootState = ReturnType<typeof store.getState>; // Exportando RootState

// Defina o tipo AppDispatch com base no dispatch da store
export type AppDispatch = typeof store.dispatch;

// Exporte a store
export default store;
