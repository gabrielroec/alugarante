"use client";

import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import React from "react";
import ProtectedRoute from "@/components/ProtectedRoute";

const PipelinesPage = () => {
  return (
    <ProtectedRoute>
      <div className="flex h-screen">
        <Sidebar />
        <div className="flex flex-col w-[80%] max-lg:w-[75%]">
          <Header />
          <div className="flex-1 overflow-auto p-6"></div>
        </div>
      </div>
    </ProtectedRoute>
  );
};

export default PipelinesPage;
