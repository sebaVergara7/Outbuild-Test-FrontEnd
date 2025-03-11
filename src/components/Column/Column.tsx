import React from "react";
import TaskList from "./TaskList";
import AddTaskForm from "./AddTaskForm";
import ColumnHeader from "./ColumnHeader";
import AddTaskButton from "./AddTaskButton";
import { ColumnProps, useColumn } from "@/hooks/useColumn";

const Column: React.FC<ColumnProps> = ({ column }) => {
  const {
    ref,
    isOver,
    isAddingTask,
    newTaskContent,
    setNewTaskContent,
    handleAddTask,
    handleCancelAddTask,
    setIsAddingTask,
    tasks,
  } = useColumn({ column });

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
