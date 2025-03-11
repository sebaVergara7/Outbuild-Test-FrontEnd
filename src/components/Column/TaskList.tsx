/**
 * Component that renders a list of Task components based on the taskIds array in a column. Maps through each task ID and renders the corresponding Task component with necessary props.
 */

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
