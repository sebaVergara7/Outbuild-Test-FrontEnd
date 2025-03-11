import React from "react";
import { TaskProps, useTask } from "@/hooks/useTask";
import TaskContent from "./TaskContent";
import TaskEditForm from "./TaskEditForm";
import TaskActions from "./TaskActions";
import TaskDragDrop from "./TaskDragDrop";
import TaskStatus from "./TaskStatus";
import formatDate from "@/utils/dateUtils";

interface IProps extends TaskProps {
  index: number;
  columnId: string;
}

const Task: React.FC<IProps> = ({ task, index, columnId }) => {
  const {
    isEditing,
    setIsEditing,
    editContent,
    setEditContent,
    handleSave,
    handleKeyPress,
    isBeingEditedByOther,
    isBeingMovedByOther,
    deleteTask,
  } = useTask({ task });

  return (
    <TaskDragDrop
      task={task}
      index={index}
      columnId={columnId}
      isBeingEditedByOther={isBeingEditedByOther}
      isBeingMovedByOther={isBeingMovedByOther}
      isEditing={isEditing}
    >
      <div
        className={`p-3 bg-white rounded shadow relative ${
          isBeingEditedByOther || isBeingMovedByOther
            ? "border-2 border-yellow-400"
            : ""
        }`}
      >
        <TaskStatus
          isBeingEditedByOther={isBeingEditedByOther}
          isBeingMovedByOther={isBeingMovedByOther}
        />

        {isEditing ? (
          <TaskEditForm
            editContent={editContent}
            setEditContent={setEditContent}
            handleSave={handleSave}
            handleKeyPress={handleKeyPress}
            setIsEditing={setIsEditing}
            taskContent={task.content}
          />
        ) : (
          <TaskContent task={task} />
        )}

        {!isEditing && (
          <TaskActions
            setIsEditing={setIsEditing}
            deleteTask={deleteTask}
            taskId={task.id}
            isBeingEditedByOther={isBeingEditedByOther}
            isBeingMovedByOther={isBeingMovedByOther}
          />
        )}
        <div className="flex text-sm text-gray-400 absolute bottom-2 left-2 ">
          {formatDate(task.createdAt)}
        </div>
      </div>
    </TaskDragDrop>
  );
};

export default Task;
