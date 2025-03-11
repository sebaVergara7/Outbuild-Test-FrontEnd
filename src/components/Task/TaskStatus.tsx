import { TaskStatusProps, useTaskStatus } from "@/hooks/useTaskStatus";
import React from "react";

const TaskStatus: React.FC<TaskStatusProps> = ({
  isBeingEditedByOther,
  isBeingMovedByOther,
}) => {
  const { showTaskStatus, showTaskStatusText } = useTaskStatus({
    isBeingEditedByOther,
    isBeingMovedByOther,
  });

  if (!showTaskStatus) return null;

  return (
    <div className="text-xs text-yellow-600 mb-1">{showTaskStatusText}</div>
  );
};

export default TaskStatus;
