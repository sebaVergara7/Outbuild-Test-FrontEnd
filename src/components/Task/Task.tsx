import React, { useState, useEffect, useMemo } from "react";
import { useBoard } from "@/contexts/BoardContext";
import TaskContent from "./TaskContent";
import TaskEditForm from "./TaskEditForm";
import TaskActions from "./TaskActions";
import TaskDragDrop from "./TaskDragDrop";
import TaskStatus from "./TaskStatus";

interface TaskProps {
  task: {
    id: string;
    content: string;
  };
  index: number;
  columnId: string;
}

const Task: React.FC<TaskProps> = ({ task, index, columnId }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editContent, setEditContent] = useState(task.content);
  const {
    updateTask,
    deleteTask,
    activeEditors,
    activeMovings,
    startEditingTask,
    stopEditingTask,
  } = useBoard();

  const isBeingEditedByOther = useMemo(
    () =>
      !!activeEditors[task.id] &&
      activeEditors[task.id] !== localStorage.getItem("userId"),
    [activeEditors, task.id]
  );

  const isBeingMovedByOther = useMemo(
    () =>
      !!activeMovings[task.id] &&
      activeMovings[task.id] !== localStorage.getItem("userId"),
    [activeMovings, task.id]
  );

  useEffect(() => {
    setEditContent(task.content);
  }, [task.content]);

  useEffect(() => {
    if (isEditing) {
      startEditingTask(task.id);
    } else {
      stopEditingTask(task.id);
    }

    return () => {
      if (isEditing) {
        stopEditingTask(task.id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, task.id]);

  const handleSave = () => {
    if (editContent.trim() !== task.content) {
      updateTask(task.id, editContent.trim());
    }
    setIsEditing(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

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
        className={`p-3 bg-white rounded shadow ${
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
      </div>
    </TaskDragDrop>
  );
};

export default Task;
