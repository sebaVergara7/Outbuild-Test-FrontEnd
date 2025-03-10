import React from "react";

interface TaskActionsProps {
  setIsEditing: (isEditing: boolean) => void;
  deleteTask: (taskId: string) => void;
  taskId: string;
  isBeingEditedByOther: boolean;
  isBeingMovedByOther: boolean;
}

const TaskActions: React.FC<TaskActionsProps> = ({
  setIsEditing,
  deleteTask,
  taskId,
  isBeingEditedByOther,
  isBeingMovedByOther,
}) => {
  return (
    <div className="flex justify-end mt-2 text-sm">
      <button
        className="text-blue-500 mr-2 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => setIsEditing(true)}
        disabled={isBeingEditedByOther || isBeingMovedByOther}
      >
        Edit
      </button>
      <button
        className="text-red-500 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
        onClick={() => deleteTask(taskId)}
        disabled={isBeingEditedByOther || isBeingMovedByOther}
      >
        Delete
      </button>
    </div>
  );
};

export default TaskActions;
