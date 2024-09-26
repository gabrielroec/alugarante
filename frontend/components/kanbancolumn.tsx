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
}

const KanbanColumn = ({
  column,
  boardId,
  boardName,
  columns,
  onCardMove,
  onColumnNameChange,
  onCardRemoved,
  onCardAdded, // Receba a nova prop
}: KanbanColumnProps) => {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [newColumnName, setNewColumnName] = useState(column.name); // Armazena o novo nome da coluna

  const columnRef = useRef<HTMLDivElement>(null); // Ref para a div da coluna

  // Função drop, quando o card for solto
  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item: { id: string }) => {
      if (item) {
        onCardMove(item.id, column.id);
      }
    },
  });

  // Função para editar o nome da coluna
  const handleEditColumnName = async () => {
    try {
      // Faz a requisição para atualizar o nome da coluna no backend
      await api.patch(`/columns/${column.id}`, { name: newColumnName });

      // Atualiza o nome da coluna no frontend chamando a função de callback
      onColumnNameChange(column.id, newColumnName);

      // Fechar o diálogo após a edição
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error("Erro ao editar nome da coluna:", error);
      // Opcional: Adicione feedback ao usuário, como uma notificação de erro
    }
  };

  // Função para adicionar um novo card em branco
  const handleAddBlankCard = async () => {
    try {
      // Faz a requisição para criar um card em branco
      const response = await api.post(`/cards/blank`, { boardId });

      const newCard = response.data;

      // Chama a função de callback para atualizar o estado no componente pai
      onCardAdded(column.id, newCard);
    } catch (error) {
      console.error("Erro ao adicionar card em branco:", error);
      // Opcional: Adicione feedback ao usuário, como uma notificação de erro
    }
  };

  drop(columnRef); // Aplicar o drop na referência da coluna

  return (
    <Fragment>
      <div ref={columnRef} className="bg-[#F7F8F3] p-[20px] rounded-lg w-full max-w-[428px]">
        <div className="flex items-center justify-between mb-5">
          <p>{column.name}</p>
          <p className="ml-[20px] text-[#D9D9D9]">Total: {column.cards?.length || 0}</p>
          <Button className="ml-[20px] bg-[#87A644]" onClick={() => setIsEditDialogOpen(true)}>
            Editar nome
          </Button>
        </div>

        {/* Renderizar os cards dentro da coluna */}
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

        {/* Botão para adicionar um novo card em branco */}
        <Button className="w-full my-[20px] bg-[#87A644]" onClick={handleAddBlankCard}>
          Novo card
        </Button>

        {/* Diálogo para editar o nome da coluna */}
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
