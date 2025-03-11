/**
 * Renders the main content area of the Kanban board, displaying all columns horizontally with scrolling enabled.
 */

import React from "react";
import Column from "@/components/Column/Column";

interface BoardContentProps {
  columns: { [key: string]: any };
}

const BoardContent: React.FC<BoardContentProps> = ({ columns }) => {
  return (
    <div className="flex-1 p-4 overflow-x-auto">
      <div className="flex space-x-4 h-full">
        {Object.values(columns).map((column) => (
          <Column key={column.id} column={column} />
        ))}
      </div>
    </div>
  );
};

export default BoardContent;
