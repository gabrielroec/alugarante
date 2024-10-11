"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React from "react";
import { KanbanProvider } from "@/contexts/KanbanContext";
import KanbanBoard from "@/components/kanbanboard";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import ProtectedRoute from "@/components/ProtectedRoute";

const PipelinesPage = () => {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <KanbanProvider>
          <div className="flex flex-col w-[80%] max-lg:w-[75%]">
            <Header />
            <div className="flex-1 overflow-auto p-6">
              <DndProvider backend={HTML5Backend}>
                <div className="h-full w-[1080px] overflow-auto">
                  {/* A largura está definida como 800px, você pode ajustar conforme necessário */}
                  <KanbanBoard />
                </div>
              </DndProvider>
            </div>
          </div>
        </KanbanProvider>
      </div>
    </ProtectedRoute>
  );
};

export default PipelinesPage;
