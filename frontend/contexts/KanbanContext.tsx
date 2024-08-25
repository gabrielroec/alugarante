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
  updateBoardName: (boardId: string, newName: string) => void;
  addBoard: (pipelineName: PipelineKeys, newBoardName: string) => void;
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

  const updateBoardName = (boardId: string, newName: string) => {
    setPipelines((prevPipelines) => {
      const updatedPipelines = { ...prevPipelines };

      Object.keys(updatedPipelines).forEach((pipelineName) => {
        updatedPipelines[pipelineName] = updatedPipelines[pipelineName].map((board) =>
          board.id === boardId ? { ...board, name: newName } : board
        );
      });

      return updatedPipelines;
    });
  };

  const addBoard = (pipelineName: PipelineKeys, newBoardName: string) => {
    setPipelines((prevPipelines) => {
      const newBoard: Board = {
        id: Date.now().toString(),
        name: newBoardName,
        cards: [],
      };

      const updatedPipeline = [...prevPipelines[pipelineName], newBoard];
      return { ...prevPipelines, [pipelineName]: updatedPipeline };
    });
  };

  const moveCard = (pipelineName: PipelineKeys, fromBoardId: string, toBoardId: string, cardId: string) => {
    setPipelines((prevPipelines) => {
      const sourceBoard = prevPipelines[pipelineName].find((board) => board.id === fromBoardId);
      if (!sourceBoard) return prevPipelines;

      const cardToMove = sourceBoard.cards.find((card) => card.id === cardId);
      if (!cardToMove) return prevPipelines;

      // Evita mover o card se for para o mesmo board ou se o targetBoard não existir
      if (fromBoardId === toBoardId || !toBoardId) {
        return prevPipelines;
      }

      const targetBoard = prevPipelines[pipelineName].find((board) => board.id === toBoardId);
      if (!targetBoard) {
        return prevPipelines;
      }

      // Remove o card do board de origem
      const updatedSourceBoard: Board = {
        ...sourceBoard,
        cards: sourceBoard.cards.filter((card) => card.id !== cardId),
      };

      // Adiciona o card ao board de destino
      const updatedTargetBoard: Board = {
        ...targetBoard,
        cards: [...targetBoard.cards, cardToMove],
      };

      // Atualiza o pipeline com as mudanças
      const updatedPipeline = prevPipelines[pipelineName].map((board) =>
        board.id === fromBoardId ? updatedSourceBoard : board.id === toBoardId ? updatedTargetBoard : board
      );

      return { ...prevPipelines, [pipelineName]: updatedPipeline };
    });
  };

  return (
    <KanbanContext.Provider value={{ selectedPipeline, setSelectedPipeline, pipelines, addCard, moveCard, updateBoardName, addBoard }}>
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
