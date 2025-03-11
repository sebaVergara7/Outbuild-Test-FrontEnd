/**
 * Header component for a column that displays the column title and the count of tasks it contains.
 */

import React from "react";

interface ColumnHeaderProps {
  title: string;
  taskCount: number;
}

const ColumnHeader: React.FC<ColumnHeaderProps> = ({ title, taskCount }) => {
  return (
    <div className="p-3 bg-gray-300 rounded-t-lg">
      <h2 className="font-semibold text-gray-700">{title}</h2>
      <span className="text-sm text-gray-500">{taskCount} tasks</span>
    </div>
  );
};

export default ColumnHeader;
