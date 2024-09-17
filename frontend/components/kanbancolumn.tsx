"use client";
import { Fragment, useRef, useState } from "react";
import { useDrop } from "react-dnd";
import KanbanCard from "./kanbancard";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

const KanbanColumn = ({ column, onCardMove }: { column: any; onCardMove: (cardId: string, targetColumnId: string) => void }) => {
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDetails, setNewCardDetails] = useState("");

  const columnRef = useRef<HTMLDivElement>(null); // Ref para a div da coluna

  // Função drop, quando o card for solto
  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item: { id: string }) => {
      // Chamar a função que vai mover o card (onCardMove) passando o id do card e da coluna de destino
      if (item) {
        onCardMove(item.id, column.id);
      }
    },
  });

  const handleAddCard = () => {
    const newCard = { id: Date.now().toString(), title: newCardTitle, details: newCardDetails };
    column.cards.push(newCard); // Atualize a coluna localmente
    setNewCardTitle("");
    setNewCardDetails("");
    setIsCardDialogOpen(false);
  };

  drop(columnRef); // Aplicar o drop na referência da coluna

  return (
    <Fragment>
      <div ref={columnRef} className="bg-[#F7F8F3] p-[20px] rounded-lg w-full max-w-[428px]">
        <div className="flex items-center justify-between">
          <p>{column.name}</p>
          <p className="ml-[20px] text-[#D9D9D9]">Total: {column.cards?.length || 0}</p>
        </div>

        {/* Renderizar os cards dentro da coluna */}
        {column.cards?.map((card: any) => (
          <KanbanCard key={card.id} card={card} />
        ))}

        {/* Diálogo para adicionar um novo card */}
        <Dialog open={isCardDialogOpen} onOpenChange={setIsCardDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full my-[20px] bg-[#87A644]">Novo card</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Criar Novo Card</DialogTitle>
            </DialogHeader>
            <Input value={newCardTitle} onChange={(e) => setNewCardTitle(e.target.value)} placeholder="Título do card" />
            <Textarea value={newCardDetails} onChange={(e) => setNewCardDetails(e.target.value)} placeholder="Detalhes do card" />
            <DialogFooter>
              <Button className="bg-[#87A644] w-full" onClick={handleAddCard}>
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
