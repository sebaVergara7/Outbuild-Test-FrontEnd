/**
 * Button component that allows users to add new tasks to a column. Displays an "Add task" label and triggers the provided onClick handler when clicked.
 */

import React from "react";

interface AddTaskButtonProps {
  onClick: () => void;
}

const AddTaskButton: React.FC<AddTaskButtonProps> = ({ onClick }) => {
  return (
    <button
      className="p-2 mt-2 text-gray-500 hover:bg-gray-300 rounded text-center cursor-pointer"
      onClick={onClick}
    >
      + Add task
    </button>
  );
};

export default AddTaskButton;
