import React from "react";

interface TaskStatusProps {
  isBeingEditedByOther: boolean;
  isBeingMovedByOther: boolean;
}

const TaskStatus: React.FC<TaskStatusProps> = ({
  isBeingEditedByOther,
  isBeingMovedByOther,
}) => {
  return (
    <>
      {isBeingEditedByOther && (
        <div className="text-xs text-yellow-600 mb-1">
          Being edited by another user
        </div>
      )}

      {isBeingMovedByOther && (
        <div className="text-xs text-yellow-600 mb-1">
          Being moved by another user
        </div>
      )}
    </>
  );
};

export default TaskStatus;
