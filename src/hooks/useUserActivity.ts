/**
 * Custom hook to determine and display the current activity of a user.
 */

import { useMemo } from "react";
import { useBoard } from "@/contexts/BoardContext";

export interface UserActivityProps {
  userId: string;
}

export const useUserActivity = ({ userId }: UserActivityProps) => {
  const { activeEditors, activeMovings, tasks } = useBoard();

  const userActivity = useMemo(() => {
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
  }, [activeEditors, activeMovings, tasks, userId]);

  return userActivity;
};
