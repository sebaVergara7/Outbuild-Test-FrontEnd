import React from "react";
import { useBoard } from "@/contexts/BoardContext";

interface UserActivityProps {
  userId: string;
}

const UserActivity: React.FC<UserActivityProps> = ({ userId }) => {
  const { activeEditors, activeMovings, tasks } = useBoard();

  const getUserActivity = () => {
    const taskId = Object.keys(activeEditors).find(
      (taskId) => activeEditors[taskId] === userId
    );

    if (taskId && tasks[taskId]) {
      return `Editing: ${tasks[taskId].content.substring(0, 15)}...`;
    }

    const movingTaskId = Object.keys(activeMovings).find(
      (taskId) => activeMovings[taskId] === userId
    );

    if (movingTaskId && tasks[movingTaskId]) {
      return `Moving: ${tasks[movingTaskId].content.substring(0, 15)}...`;
    }

    return "Online";
  };

  return <>{getUserActivity()}</>;
};

export default UserActivity;
