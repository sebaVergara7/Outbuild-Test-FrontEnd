/**
 * Custom hook to determine and display the status of a task being edited or moved by another user.
 */

import { useMemo } from "react";

export interface TaskStatusProps {
  isBeingEditedByOther: boolean;
  isBeingMovedByOther: boolean;
}

export const useTaskStatus = ({
  isBeingEditedByOther,
  isBeingMovedByOther,
}: TaskStatusProps) => {
  const showTaskStatus = useMemo(
    () => isBeingEditedByOther || isBeingMovedByOther,
    [isBeingEditedByOther, isBeingMovedByOther]
  );

  const showTaskStatusText = useMemo(() => {
    if (isBeingEditedByOther) {
      return "Being edited by another user";
    }
    if (isBeingMovedByOther) {
      return "Being moved by another user";
    }
    return "";
  }, [isBeingEditedByOther, isBeingMovedByOther]);

  return { showTaskStatus, showTaskStatusText };
};
