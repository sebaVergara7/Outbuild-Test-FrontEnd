/**
 * Main Board container component that provides drag-and-drop functionality and renders the header and content sections of the Kanban board.
 */

import React from "react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import BoardHeader from "./BoardHeader";
import BoardContent from "./BoardContent";
import { useBoard } from "@/contexts/BoardContext";

const Board: React.FC = () => {
  const { columns } = useBoard();

  return (
    <div className="flex flex-col h-screen bg-gray-50">
      <BoardHeader />
      <DndProvider backend={HTML5Backend}>
        <BoardContent columns={columns} />
      </DndProvider>
    </div>
  );
};

export default Board;
