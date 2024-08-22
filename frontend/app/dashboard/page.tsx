"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React from "react";
import { KanbanProvider } from "@/contexts/KanbanContext";
import KanbanBoard from "@/components/kanbanboard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

const PipelinesPage = () => {
  return (
    <div className="flex">
      <Sidebar />
      <KanbanProvider>
        <div className="flex-1">
          <Header />

          <div className="p-6">
            <DndProvider backend={HTML5Backend}>
              <KanbanBoard />
            </DndProvider>
          </div>
        </div>
      </KanbanProvider>
    </div>
  );
};

export default PipelinesPage;
