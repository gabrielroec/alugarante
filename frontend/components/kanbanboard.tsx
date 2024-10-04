// kanbanboard.tsx

"use client";
import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/redux/store";
import { fetchBoardById } from "@/redux/boardSlice";
import { useEffect, useState } from "react";
import KanbanColumn from "./kanbancolumn";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import api from "@/services/api";
import { useToast } from "@/components/ui/use-toast";

// Função para mover o card entre colunas e atualizar no backend
const moveCard = async (cardId: string, targetColumnId: number, dispatch: AppDispatch, boardId: number) => {
  try {
    // Chamada para o backend para atualizar o card com o novo columnId
    const response = await api.post(`/cards/${cardId}/move`, {
      targetColumnId,
    });

    if (response.status !== 200) {
      throw new Error("Erro ao mover card");
    }

    // Após mover o card, faça um novo fetch dos dados do board para atualizar o estado global
    dispatch(fetchBoardById(boardId.toString()));
  } catch (error) {
    console.error("Erro ao mover card:", error);
  }
};

const KanbanBoard = () => {
  const { selectedBoard, loading, error } = useSelector((state: RootState) => state.boards);
  const dispatch = useDispatch<AppDispatch>();
  const [columns, setColumns] = useState<any[]>([]);
  const [isAddColumnDialogOpen, setIsAddColumnDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState("");
  const { toast } = useToast();

  useEffect(() => {
    if (!selectedBoard) {
      dispatch(fetchBoardById("1"));
    }
  }, [dispatch, selectedBoard]);

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

  const handleCardMove = (cardId: string, targetColumnId: number) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        const newCards = col.cards.filter((card: any) => card.id !== cardId);
        if (col.id === targetColumnId) {
          return {
            ...col,
            cards: [...col.cards, { id: cardId }],
          };
        }
        return {
          ...col,
          cards: newCards,
        };
      })
    );

    moveCard(cardId, targetColumnId, dispatch, boardId!);
  };

  const handleColumnNameChange = (columnId: number, newName: string) => {
    setColumns((prevColumns) => prevColumns.map((col) => (col.id === columnId ? { ...col, name: newName } : col)));
  };

  const handleAddColumn = async () => {
    if (newColumnName.trim()) {
      try {
        const response = await api.post(`/boards/${boardId}/columns`, { name: newColumnName });
        const newColumn = response.data;
        setColumns((prevColumns) => [...prevColumns, newColumn]);
        setNewColumnName("");
        setIsAddColumnDialogOpen(false);
      } catch (error) {
        console.error("Erro ao adicionar coluna:", error);
      }
    } else {
      alert("Por favor, insira um nome para a coluna.");
    }
  };

  const handleDeleteColumn = async (columnId: number) => {
    try {
      await api.delete(`/columns/${columnId}`);
      setColumns((prevColumns) => prevColumns.filter((col) => col.id !== columnId));
    } catch (error) {
      console.error("Erro ao deletar coluna:", error);
      toast({
        variant: "destructive",
        title: "Erro ao deletar coluna!",
        description: "Certifique-se que a sua coluna esteja sem cards para poder agalá-la.",
      });
    }
  };

  if (loading) {
    return <p>Carregando...</p>;
  }

  if (error) {
    return <p>Erro ao carregar boards: {error}</p>;
  }

  const handleCardAdded = (columnId: number, newCard: any) => {
    setColumns((prevColumns) =>
      prevColumns.map((col) => {
        if (col.id === columnId) {
          return {
            ...col,
            cards: [...col.cards, newCard],
          };
        }
        return col;
      })
    );
  };

  return (
    <div>
      <Button onClick={() => setIsAddColumnDialogOpen(true)} className="mb-4 bg-[#87A644]">
        Adicionar Coluna
      </Button>

      <Dialog open={isAddColumnDialogOpen} onOpenChange={setIsAddColumnDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Coluna</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <Input value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} placeholder="Nome da nova coluna" />
          </div>
          <DialogFooter>
            <Button className="bg-[#87A644] w-full mt-4" onClick={handleAddColumn}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
            onCardRemoved={handleCardRemoved}
            onCardAdded={handleCardAdded}
            onDeleteColumn={handleDeleteColumn} // Passar a função de deletar coluna
          />
        ))}
      </div>
    </div>
  );
};

export default KanbanBoard;
