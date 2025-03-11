import { useState, useRef, useEffect, useCallback } from "react";
import { useDrop } from "react-dnd";
import { useBoard } from "@/contexts/BoardContext";

export interface ColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
}

export const useColumn = ({ column }: ColumnProps) => {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [newTaskContent, setNewTaskContent] = useState("");
  const { tasks, createTask, moveTask } = useBoard();
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isOver }, drop] = useDrop({
    accept: "TASK",
    drop: (item: { id: string; sourceColumnId: string; index: number }) => {
      const { id, sourceColumnId } = item;
      const destinationIndex = column.taskIds.length;

      if (sourceColumnId !== column.id) {
        moveTask(id, sourceColumnId, column.id, destinationIndex);
      }
    },
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
    }),
  });

  useEffect(() => {
    if (ref.current) {
      drop(ref.current);
    }
  }, [drop]);

  const handleAddTask = useCallback(() => {
    if (newTaskContent.trim()) {
      createTask(column.id, newTaskContent.trim());
      setNewTaskContent("");
      setIsAddingTask(false);
    }
  }, [column.id, createTask, newTaskContent]);

  const handleCancelAddTask = useCallback(() => {
    setNewTaskContent("");
    setIsAddingTask(false);
  }, []);

  return {
    ref,
    isOver,
    isAddingTask,
    newTaskContent,
    setNewTaskContent,
    handleAddTask,
    handleCancelAddTask,
    setIsAddingTask,
    tasks,
  };
};
