import React from "react";
import Task from "@/components/Task/Task";

interface TaskListProps {
  column: {
    id: string;
    taskIds: string[];
  };
  tasks: { [key: string]: any };
}

const TaskList: React.FC<TaskListProps> = ({ column, tasks }) => {
  return (
    <>
      {column.taskIds.map((taskId, index) => (
        <Task
          key={taskId}
          task={tasks[taskId]}
          index={index}
          columnId={column.id}
        />
      ))}
    </>
  );
};

export default TaskList;
