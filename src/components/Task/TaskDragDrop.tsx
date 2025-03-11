/**
 * Wrapper component that adds drag-and-drop functionality to task cards using react-dnd and framer-motion for animations. Handles the visual effects when a task is being dragged.
 */

import React from "react";
import { motion } from "framer-motion";
import { TaskDragDropProps, useTaskDragDrop } from "@/hooks/useTaskDragDrop";

const TaskDragDrop: React.FC<TaskDragDropProps> = ({
  task,
  index,
  columnId,
  isBeingEditedByOther,
  isBeingMovedByOther,
  isEditing,
  children,
}) => {
  const { ref, isDragging } = useTaskDragDrop({
    task,
    index,
    columnId,
    isBeingEditedByOther,
    isBeingMovedByOther,
    isEditing,
  });

  return (
    <motion.div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1 }}
      initial={{ scale: 1 }}
      animate={{ scale: isDragging ? 1.03 : 1 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.div>
  );
};

export default TaskDragDrop;
