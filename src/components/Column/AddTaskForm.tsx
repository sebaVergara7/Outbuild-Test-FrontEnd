/**
 * Form component for adding a new task, containing a textarea for the task content and buttons for confirming or canceling the operation.
 */

import React from "react";

interface AddTaskFormProps {
  newTaskContent: string;
  setNewTaskContent: (content: string) => void;
  handleAddTask: () => void;
  handleCancelAddTask: () => void;
}

const AddTaskForm: React.FC<AddTaskFormProps> = ({
  newTaskContent,
  setNewTaskContent,
  handleAddTask,
  handleCancelAddTask,
}) => {
  return (
    <div className="p-3 bg-white rounded shadow">
      <textarea
        className="w-full p-2 border rounded text-black"
        placeholder="Task content..."
        value={newTaskContent}
        onChange={(e) => setNewTaskContent(e.target.value)}
        autoFocus
      />
      <div className="flex justify-end mt-2">
        <button
          className="px-3 py-1 bg-red-400 hover:bg-red-500 rounded mr-2 text-white cursor-pointer"
          onClick={handleCancelAddTask}
        >
          Cancel
        </button>
        <button
          className="px-3 py-1 bg-blue-500 hover:bg-blue-600 text-white rounded cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={!newTaskContent.trim()}
          onClick={handleAddTask}
        >
          Add
        </button>
      </div>
    </div>
  );
};

export default AddTaskForm;
