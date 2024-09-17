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
