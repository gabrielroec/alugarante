"use client";
import { useKanban } from "@/contexts/KanbanContext";
import { useDrop } from "react-dnd";
import KanbanCard from "./kanbancard";

interface CardItem {
  id: string;
  fromBoardId: string;
}

const KanbanColumn = ({ board, pipelineName }: { board: any; pipelineName: any }) => {
  const { moveCard } = useKanban();

  const [, drop] = useDrop({
    accept: "CARD",
    drop: (item: CardItem) => {
      moveCard(pipelineName, item.fromBoardId, board.id, item.id);
    },
  });
  return (
    <div ref={drop as unknown as React.RefObject<HTMLDivElement>} className="w-64 bg-gray-100 p-4 rounded-lg shadow-md">
      <h2 className="font-bold text-lg">{board.name}</h2>
      {board.cards.map((card: { id: any }) => (
        <KanbanCard key={card.id} card={card} fromBoardId={board.id} pipelineName={pipelineName} />
      ))}
    </div>
  );
};

export default KanbanColumn;
