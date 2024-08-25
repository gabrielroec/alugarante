import { useState } from "react";
import { useKanban } from "@/contexts/KanbanContext";
import KanbanColumn from "./kanbancolumn";
import { Button } from "./ui/button";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogFooter, DialogTitle } from "./ui/dialog";
import { Input } from "./ui/input";
import { Pipelines } from "@/types/kanban";

const KanbanBoard = ({ className }: any) => {
  const { selectedPipeline, pipelines, addBoard } = useKanban();
  const [newBoardName, setNewBoardName] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const pipelineKey = selectedPipeline as keyof Pipelines;

  const handleAddBoard = () => {
    if (newBoardName.trim() !== "") {
      addBoard(pipelineKey, newBoardName);
      setNewBoardName("");
      setIsDialogOpen(false);
    }
  };

  return (
    <div className="flex space-x-4">
      {pipelines[pipelineKey]?.map((board: any) => (
        <KanbanColumn key={board.id} board={board} pipelineName={selectedPipeline} />
      ))}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogTrigger asChild>
          <Button className="w-full max-w-[200px] bg-[#87A644]">Adicionar etapa</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Adicionar Nova Lista</DialogTitle>
          </DialogHeader>
          <Input value={newBoardName} onChange={(e) => setNewBoardName(e.target.value)} placeholder="Nome da nova lista" />
          <DialogFooter>
            <Button className="bg-[#87A644] w-full" onClick={handleAddBoard}>
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default KanbanBoard;
