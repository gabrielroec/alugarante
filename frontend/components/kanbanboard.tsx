"use client";
import { useKanban } from "@/contexts/KanbanContext";
import { Board, Pipelines } from "@/types/kanban";
import KanbanColumn from "./kanbancolumn";
import { useEffect } from "react";

const KanbanBoard = () => {
  const { selectedPipeline, pipelines } = useKanban();

  const pipelineKey = selectedPipeline as keyof Pipelines;

  useEffect(() => {
    console.log("Selected Pipeline:", selectedPipeline);
    console.log("Boards:", pipelines[pipelineKey]);
  }, [selectedPipeline, pipelines, pipelineKey]);

  console.log("Renderizando KanbanBoard com pipeline:", selectedPipeline);
  console.log("Boards para esse pipeline:", pipelines[pipelineKey]);

  useEffect(() => {
    console.log("Pipeline mudou no KanbanBoard:", selectedPipeline);
  }, [selectedPipeline]);

  return (
    <div className="flex space-x-4">
      {pipelines[pipelineKey]?.map((board: Board) => (
        <KanbanColumn key={board.id} board={board} pipelineName={selectedPipeline} />
      ))}
    </div>
  );
};

export default KanbanBoard;
