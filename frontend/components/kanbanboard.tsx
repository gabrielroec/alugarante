"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchBoardById } from "@/redux/boardSlice";
import { useEffect, useState } from "react";
import KanbanColumn from "./kanbancolumn";

// Função para mover o card entre colunas e atualizar no backend
const moveCard = async (cardId: string, targetColumnId: string, dispatch: AppDispatch, boardId: string) => {
  try {
    // Chamada para o backend para atualizar o card com o novo columnId
    const response = await fetch(`http://localhost:5000/api/cards/${cardId}/move`, {
      method: "POST",
      body: JSON.stringify({ targetColumnId }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Erro ao mover card");
    }

    // Após mover o card, faça um novo fetch dos dados do board para atualizar o estado global
    dispatch(fetchBoardById(boardId));
  } catch (error) {
    console.error("Erro ao mover card:", error);
  }
};

const KanbanBoard = () => {
  const { selectedBoard, loading, error } = useSelector((state: RootState) => state.boards);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<any[]>([]);

  // Carregar o board inicial quando o componente é montado
  useEffect(() => {
    if (!selectedBoard) {
      dispatch(fetchBoardById("1")); // Carregar o board com ID 1 como padrão
    }
  }, [dispatch, selectedBoard]);

  // Atualizar as colunas locais quando o board selecionado for atualizado
  useEffect(() => {
    if (selectedBoard) {
      setColumns(selectedBoard.columns);
    }
  }, [selectedBoard]);

  // Função chamada quando um card for movido para uma nova coluna
  const handleCardMove = (cardId: string, targetColumnId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        const newCards = col.cards.filter((card: any) => card.id !== cardId); // Remove o card da coluna antiga
        if (col.id === targetColumnId) {
          return {
            ...col,
            cards: [...col.cards, { id: cardId }], // Adiciona o card à nova coluna
          };
        }
        return {
          ...col,
          cards: newCards,
        };
      })
    );

    // Chamar a função para mover o card no backend e atualizar o estado global
    moveCard(cardId, targetColumnId, dispatch, selectedBoard!.id);
  };

  // Função para atualizar o nome da coluna localmente
  const handleColumnNameChange = (columnId: string, newName: string) => {
    setColumns((prevColumns) => prevColumns.map((col) => (col.id === columnId ? { ...col, name: newName } : col)));
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar boards: {error}</p>;
  }

  return (
    <div className="flex space-x-4">
      {columns?.map((column) => (
        <KanbanColumn
          key={column.id}
          column={column}
          boardName={selectedBoard!.name} // Passando o nome do board
          columns={columns} // Certifique-se de passar todas as colunas para o KanbanColumn
          onCardMove={handleCardMove}
          onColumnNameChange={handleColumnNameChange}
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
