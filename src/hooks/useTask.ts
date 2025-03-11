/**
 * Custom hook to manage task state, including editing and movement operations.
 */

import { useState, useEffect, useMemo, useCallback } from "react";
import { useBoard } from "@/contexts/BoardContext";

export interface TaskProps {
  task: {
    id: string;
    content: string;
    createdAt: string;
  };
}

export const useTask = ({ task }: TaskProps) => {
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

  const handleSave = useCallback(() => {
    if (editContent.trim() !== task.content) {
      updateTask(task.id, editContent.trim());
    }
    setIsEditing(false);
  }, [editContent, task.content, task.id, updateTask]);

  const handleKeyPress = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSave();
      }
    },
    [handleSave]
  );

  return {
    isEditing,
    setIsEditing,
    editContent,
    setEditContent,
    handleSave,
    handleKeyPress,
    isBeingEditedByOther,
    isBeingMovedByOther,
    deleteTask,
  };
};
