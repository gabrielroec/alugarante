"use client";
import React from "react";
import { useDrag } from "react-dnd";

const KanbanCard = ({ card, fromBoardId, pipelineName }: any) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "CARD",
    item: { id: card.id, fromBoardId, pipelineName },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  return (
    <div
      ref={drag as unknown as React.RefObject<HTMLDivElement>}
      className={`p-4 bg-white rounded-lg shadow-md mb-2 ${isDragging ? "opacity-50" : ""}`}
    >
      <h3 className="font-semibold">{card.title}</h3>
      <p className="text-gray-600">{card.details}</p>
    </div>
  );
};

export default KanbanCard;
