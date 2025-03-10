import React from "react";

interface TaskContentProps {
  task: {
    id: string;
    content: string;
  };
}

const TaskContent: React.FC<TaskContentProps> = ({ task }) => {
  return (
    <div>
      <p className="whitespace-pre-wrap break-words text-gray-700">
        {task.content}
      </p>
    </div>
  );
};

export default TaskContent;
