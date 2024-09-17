import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// Definição das interfaces para os dados dos boards, colunas e cards
interface Board {
  id: string;
  name: string;
  columns: Column[];
}

interface Column {
  id: string;
  name: string;
  cards: Card[];
}

interface Card {
  id: string;
  title?: string;
  description?: string;
}

// Interface para o estado inicial do slice
interface BoardState {
  boards: Board[];
  selectedBoard: Board | null;
  loading: boolean;
  error: string | null;
}

// Ação assíncrona para buscar todos os boards
export const fetchBoards = createAsyncThunk<Board[]>("boards/fetchBoards", async () => {
  const response = await api.get("boards");
  return response.data;
});

// Ação assíncrona para buscar um board específico pelo ID
export const fetchBoardById = createAsyncThunk<Board, string>("boards/fetchBoardById", async (boardId) => {
  const response = await api.get(`boards/${boardId}/columns-cards`);
  return response.data;
});

const initialState: BoardState = {
  boards: [],
  selectedBoard: null,
  loading: false,
  error: null,
};

// Criando o slice para gerenciar o estado dos boards
const boardSlice = createSlice({
  name: "boards",
  initialState,
  reducers: {
    // Action para limpar o board selecionado
    clearSelectedBoard(state) {
      state.selectedBoard = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchBoards.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoards.fulfilled, (state, action) => {
        state.loading = false;
        state.boards = action.payload;
      })
      .addCase(fetchBoards.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao buscar boards";
      })
      .addCase(fetchBoardById.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchBoardById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedBoard = action.payload;
      })
      .addCase(fetchBoardById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Erro ao buscar board";
      });
  },
});

// Exportando a action para limpar o board selecionado
export const { clearSelectedBoard } = boardSlice.actions;

export default boardSlice.reducer;
