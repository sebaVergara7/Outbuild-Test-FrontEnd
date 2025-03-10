import React, { useState, useRef, useEffect, useCallback } from "react";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import ColumnHeader from "./ColumnHeader";
import AddTaskButton from "./AddTaskButton";
import { useBoard } from "@/contexts/BoardContext";
import { useDrop } from "react-dnd";

interface ColumnProps {
  column: {
    id: string;
    title: string;
    taskIds: string[];
  };
}

const Column: React.FC<ColumnProps> = ({ column }) => {
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

  return (
    <div
      ref={ref}
      className={`w-80 flex-shrink-0 bg-gray-200 rounded-lg shadow ${
        isOver ? "bg-gray-300" : ""
      }`}
    >
      <ColumnHeader title={column.title} taskCount={column.taskIds.length} />

      <div className="p-2 flex flex-col gap-2 max-h-[calc(100vh-200px)] overflow-y-auto">
        <TaskList column={column} tasks={tasks} />

        {isAddingTask ? (
          <AddTaskForm
            newTaskContent={newTaskContent}
            setNewTaskContent={setNewTaskContent}
            handleAddTask={handleAddTask}
            handleCancelAddTask={handleCancelAddTask}
          />
        ) : (
          <AddTaskButton onClick={() => setIsAddingTask(true)} />
        )}
      </div>
    </div>
  );
};

export default Column;
