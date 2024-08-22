"use client";
import React, { createContext, useState, useContext, Dispatch, SetStateAction } from "react";
import { Board, Pipelines, Card } from "@/types/kanban";

type PipelineKeys = keyof Pipelines;

interface KanbanContextType {
  selectedPipeline: PipelineKeys;
  setSelectedPipeline: Dispatch<SetStateAction<PipelineKeys>>;
  pipelines: Pipelines;
  addCard: (pipelineName: PipelineKeys, boardId: string, card: Card) => void;
  moveCard: (pipelineName: PipelineKeys, fromBoardId: string, toBoardId: string, cardId: string) => void;
}

const KanbanContext = createContext<KanbanContextType | null>(null);

export const KanbanProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const initialPipelines: Pipelines = {
    Início: [
      {
        id: "1",
        name: "Interessados",
        cards: [{ id: "card-1", title: "Card 1", details: "Detalhes do card 1" }],
      },
      {
        id: "2",
        name: "Em análise",
        cards: [{ id: "card-2", title: "Card 2", details: "Detalhes do card 2" }],
      },
    ],
    "Contratos ativos": [
      {
        id: "3",
        name: "Etapa Inicial",
        cards: [{ id: "card-3", title: "Card 3", details: "Detalhes do card 3" }],
      },
      {
        id: "4",
        name: "Ativos",
        cards: [],
      },
    ],
    "Cobrança Extrajudicial": [
      {
        id: "5",
        name: "Etapa Inicial",
        cards: [],
      },
      {
        id: "6",
        name: "Extrajudicial",
        cards: [],
      },
    ],
    "Cobrança Judicial": [
      {
        id: "7",
        name: "Etapa Inicial",
        cards: [],
      },
      {
        id: "8",
        name: "Judicial",
        cards: [],
      },
    ],
    "Contratos inativos": [
      {
        id: "9",
        name: "Etapa Inicial",
        cards: [],
      },
      {
        id: "10",
        name: "Inativos",
        cards: [],
      },
    ],
  };

  const [selectedPipeline, setSelectedPipeline] = useState<PipelineKeys>("Início");
  const [pipelines, setPipelines] = useState<Pipelines>(initialPipelines);

  const addCard = (pipelineName: PipelineKeys, boardId: string, card: Card) => {
    setPipelines((prevPipelines) => {
      const updatedPipeline = prevPipelines[pipelineName].map((board) =>
        board.id === boardId ? { ...board, cards: [...board.cards, card] } : board
      );
      return { ...prevPipelines, [pipelineName]: updatedPipeline };
    });
  };

  const moveCard = (pipelineName: PipelineKeys, fromBoardId: string, toBoardId: string, cardId: string) => {
    setPipelines((prevPipelines) => {
      const sourceBoard = prevPipelines[pipelineName].find((board) => board.id === fromBoardId);
      if (!sourceBoard) return prevPipelines;

      const cardToMove = sourceBoard.cards.find((card) => card.id === cardId);
      if (!cardToMove) return prevPipelines;

      const updatedSourceBoard: Board = {
        ...sourceBoard,
        cards: sourceBoard.cards.filter((card) => card.id !== cardId),
      };

      const targetBoard = prevPipelines[pipelineName].find((board) => board.id === toBoardId);
      if (!targetBoard) return prevPipelines;

      const updatedTargetBoard: Board = {
        ...targetBoard,
        cards: [...targetBoard.cards, cardToMove],
      };

      const updatedPipeline = prevPipelines[pipelineName].map((board) =>
        board.id === fromBoardId ? updatedSourceBoard : board.id === toBoardId ? updatedTargetBoard : board
      );

      return { ...prevPipelines, [pipelineName]: updatedPipeline };
    });
  };

  return (
    <KanbanContext.Provider value={{ selectedPipeline, setSelectedPipeline, pipelines, addCard, moveCard }}>
      {children}
    </KanbanContext.Provider>
  );
};

export const useKanban = () => {
  const context = useContext(KanbanContext);

  if (!context) {
    throw new Error("useKanban must be used within a KanbanProvider");
  }
  return context;
};
