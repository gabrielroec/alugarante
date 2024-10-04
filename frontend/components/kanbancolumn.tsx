// components/kanbancolumn.tsx

"use client";
import { Fragment, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import KanbanCard from "./kanbancard";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import api from "@/services/api";
import { Textarea } from "./ui/textarea";

interface Column {
  id: number;
  name: string;
  cards: any[];
}

interface KanbanColumnProps {
  column: Column;
  boardId: number;
  boardName: string;
  columns: Column[];
  onCardMove: (cardId: string, targetColumnId: number) => void;
  onColumnNameChange: (columnId: number, newColumnName: string) => void;
  onCardRemoved: (cardId: string) => void;
  onCardAdded: (columnId: number, newCard: any) => void; // Nova prop
  onDeleteColumn: any;
}

const KanbanColumn = ({
  column,
  boardId,
  boardName,
  columns,
  onCardMove,
  onColumnNameChange,
  onCardRemoved,
  onCardAdded,
  onDeleteColumn, // Receba a prop de deletar coluna
}: KanbanColumnProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState(column.name);

  const columnRef = useRef<HTMLDivElement>(null);

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item: { id: string }) => {
      if (item) {
        onCardMove(item.id, column.id);
      }
    },
  });

  const handleEditColumnName = async () => {
    try {
      await api.patch(`/columns/${column.id}`, { name: newColumnName });
      onColumnNameChange(column.id, newColumnName);
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erro ao editar nome da coluna:", error);
    }
  };

  const handleAddBlankCard = async () => {
    try {
      const response = await api.post(`/cards/blank`, { boardId });
      const newCard = response.data;
      onCardAdded(column.id, newCard);
    } catch (error) {
      console.error("Erro ao adicionar card em branco:", error);
    }
  };

  drop(columnRef);

  return (
    <Fragment>
      <div ref={columnRef} className="bg-[#F7F8F3] p-[20px] rounded-lg w-full max-w-[428px]">
        <div className="flex items-center justify-between mb-5">
          <p>{column.name}</p>
          <p className="ml-[20px] text-[#D9D9D9]">Total: {column.cards?.length || 0}</p>
          <Button className="ml-[20px] bg-[#87A644]" onClick={() => setIsEditDialogOpen(true)}>
            Editar nome
          </Button>
          <Button className="ml-[10px] bg-red-500" onClick={() => onDeleteColumn(column.id)}>
            Deletar
          </Button>
        </div>

        {column.cards.map((card) => (
          <KanbanCard
            key={card.id}
            card={card}
            boardId={boardId}
            columnName={column.name}
            columns={columns}
            onCardRemoved={onCardRemoved}
          />
        ))}

        <Button className="w-full my-[20px] bg-[#87A644]" onClick={handleAddBlankCard}>
          Novo card
        </Button>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Nome da Coluna</DialogTitle>
            </DialogHeader>
            <Input value={newColumnName} onChange={(e) => setNewColumnName(e.target.value)} placeholder="Novo nome da coluna" />
            <DialogFooter>
              <Button className="bg-[#87A644] w-full" onClick={handleEditColumnName}>
                Salvar
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </Fragment>
  );
};

export default KanbanColumn;
