"use client";
import { Fragment, useState } from "react";
import { useKanban } from "@/contexts/KanbanContext";
import { useDrop } from "react-dnd";
import KanbanCard from "./kanbancard";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";

interface CardItem {
  id: string;
  fromBoardId: string;
}

const KanbanColumn = ({ board, pipelineName }: { board: any; pipelineName: any }) => {
  const { moveCard, updateBoardName, addCard } = useKanban();
  const [newBoardName, setNewBoardName] = useState(board.name);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCardDialogOpen, setIsCardDialogOpen] = useState(false);
  const [newCardTitle, setNewCardTitle] = useState("");
  const [newCardDetails, setNewCardDetails] = useState("");

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item: CardItem) => {
      moveCard(pipelineName, item.fromBoardId, board.id, item.id);
    },
  });

  const handleEditBoardName = () => {
    updateBoardName(board.id, newBoardName);
    setIsDialogOpen(false);
  };

  const handleAddCard = () => {
    const newCard = { id: Date.now().toString(), title: newCardTitle, details: newCardDetails };
    addCard(pipelineName, board.id, newCard);
    setNewCardTitle("");
    setNewCardDetails("");
    setIsCardDialogOpen(false);
  };

  return (
    <Fragment>
      <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className="bg-[#F7F8F3] p-[20px] rounded-lg w-full max-w-[428px]">
        <div className="flex items-center justify-between">
          <p>{board.name}</p>
          <p className="ml-[20px] text-[#D9D9D9]">Total: {board.cards.length}</p>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-white p-0 m-0 w-fit h-fit hover:bg-white">
                <svg width="25" height="26" viewBox="0 0 25 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.111084 6.95553C0.111084 4.71533 0.111084 3.59523 0.547058 2.73958C0.930551 1.98693 1.54247 1.37501 2.29512 0.991516C3.15077 0.555542 4.27087 0.555542 6.51108 0.555542H18.6C20.8402 0.555542 21.9603 0.555542 22.8159 0.991516C23.5686 1.37501 24.1805 1.98693 24.564 2.73958C25 3.59523 25 4.71533 25 6.95554V19.0444C25 21.2846 25 22.4047 24.564 23.2604C24.1805 24.013 23.5686 24.625 22.8159 25.0085C21.9603 25.4444 20.8402 25.4444 18.6 25.4444H6.51108C4.27087 25.4444 3.15077 25.4444 2.29512 25.0085C1.54247 24.625 0.930551 24.013 0.547058 23.2604C0.111084 22.4047 0.111084 21.2846 0.111084 19.0444V6.95553Z"
                    fill="#DDE9AD"
                  />
                  <path
                    d="M11.2805 11.7792L10.5328 14.2729C10.4693 14.485 10.5273 14.7151 10.6839 14.8715C10.7984 14.986 10.9522 15.0479 11.1096 15.0479C11.1674 15.0479 11.2257 15.0397 11.2825 15.0224L13.7764 14.2749C13.8718 14.2462 13.9589 14.1945 14.0292 14.1239L18.6014 9.55174C18.7143 9.43884 18.7778 9.28556 18.7778 9.126C18.7778 8.96645 18.7143 8.81317 18.6014 8.70026L16.8551 6.95418C16.6199 6.71897 16.2389 6.71897 16.0037 6.95418L11.4317 11.5264C11.3611 11.5969 11.3094 11.6836 11.2805 11.7792ZM12.3906 12.2704L16.4294 8.2314L17.324 9.126L13.2852 13.165L12.0076 13.548L12.3906 12.2704Z"
                    fill="#87A644"
                  />
                  <path
                    d="M18.1755 12.3979C17.8429 12.3979 17.5734 12.6676 17.5734 13.0001V17.0144C17.5734 17.568 17.1232 18.018 16.5698 18.018H8.54114C7.98779 18.018 7.53755 17.568 7.53755 17.0144V8.98575C7.53755 8.43221 7.98779 7.98216 8.54114 7.98216H12.5555C12.8881 7.98216 13.1576 7.71245 13.1576 7.38001C13.1576 7.04758 12.8881 6.77786 12.5555 6.77786H8.54114C7.32371 6.77786 6.33325 7.76851 6.33325 8.98575V17.0144C6.33325 18.2317 7.32371 19.2223 8.54114 19.2223H16.5698C17.7872 19.2223 18.7777 18.2317 18.7777 17.0144V13.0001C18.7777 12.6676 18.5082 12.3979 18.1755 12.3979Z"
                    fill="#87A644"
                  />
                </svg>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar nome da etapa</DialogTitle>
              </DialogHeader>
              <Input value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="New Board Name" />
              <DialogFooter>
                <Button className="bg-[#87A644] w-full" onClick={handleEditBoardName}>
                  Salvar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        {/* Novo Card */}
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
        {board.cards.map((card: { id: any }) => (
          <KanbanCard key={card.id} card={card} fromBoardId={board.id} pipelineName={pipelineName} />
        ))}
      </div>
    </Fragment>
  );
};

export default KanbanColumn;
