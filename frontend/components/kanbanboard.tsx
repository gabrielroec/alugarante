"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchBoardById } from "@/redux/boardSlice";
import { useEffect, useState } from "react";
import KanbanColumn from "./kanbancolumn";

// Função para mover o card entre colunas e atualizar no backend
const moveCard = async (cardId: string, targetColumnId: number, dispatch: AppDispatch, boardId: number) => {
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

  useEffect(() => {
    if (!selectedBoard) {
      dispatch(fetchBoardById(1)); // Carregar o board com ID 1 como padrão
    }
  }, [dispatch, selectedBoard]);

  // Atualizar as colunas locais quando o board selecionado for atualizado
  useEffect(() => {
    if (selectedBoard) {
      setColumns(selectedBoard.columns);
    }
  }, [selectedBoard]);

  const boardId = selectedBoard ? Number(selectedBoard.id) : null;

  if (!boardId) {
    return <p>Nenhum board selecionado.</p>;
  }

  const handleCardRemoved = (cardId: string) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => ({
        ...col,
        cards: col.cards.filter((card: any) => card.id !== cardId),
      }))
    );
  };

  // Função chamada quando um card for movido para uma nova coluna
  const handleCardMove = (cardId: string, targetColumnId: number) => {
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
    moveCard(cardId, targetColumnId, dispatch, boardId);
  };

  // Função para atualizar o nome da coluna localmente
  const handleColumnNameChange = (columnId: number, newName: string) => {
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
          boardId={boardId}
          boardName={selectedBoard!.name}
          columns={columns}
          onCardMove={handleCardMove}
          onColumnNameChange={handleColumnNameChange}
          onCardRemoved={handleCardRemoved} // Certifique-se de que esta linha está presente
        />
      ))}
    </div>
  );
};

export default KanbanBoard;
