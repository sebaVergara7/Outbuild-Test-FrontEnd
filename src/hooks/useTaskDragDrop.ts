import { useRef, useEffect } from "react";
import { useDrag, useDrop } from "react-dnd";
import { useBoard } from "@/contexts/BoardContext";

export interface TaskDragDropProps {
  task: {
    id: string;
    content: string;
  };
  index: number;
  columnId: string;
  isBeingEditedByOther: boolean;
  isBeingMovedByOther: boolean;
  isEditing: boolean;
  children: React.ReactNode;
}

export const useTaskDragDrop = ({
  task,
  index,
  columnId,
  isBeingEditedByOther,
  isBeingMovedByOther,
  isEditing,
}: Omit<TaskDragDropProps, "children">) => {
  const { moveTask, startMovingTask, stopMovingTask } = useBoard();
  const ref = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TASK",
    item: {
      id: task.id,
      index,
      sourceColumnId: columnId,
    },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isBeingEditedByOther && !isBeingMovedByOther && !isEditing,
  });

  useEffect(() => {
    if (isDragging) {
      startMovingTask(task.id);
    } else {
      stopMovingTask(task.id);
    }

    return () => {
      if (isBeingMovedByOther) {
        stopMovingTask(task.id);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging, task.id]);

  const [, drop] = useDrop({
    accept: "TASK",
    hover(
      item: { id: string; index: number; sourceColumnId: string },
      monitor
    ) {
      if (!ref.current) return;

      const dragIndex = item.index;
      const hoverIndex = index;
      const sourceColumnId = item.sourceColumnId;

      if (dragIndex === hoverIndex && sourceColumnId === columnId) return;

      const hoverBoundingRect = ref.current.getBoundingClientRect();
      const hoverMiddleY =
        (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
      const clientOffset = monitor.getClientOffset();
      const hoverClientY = clientOffset!.y - hoverBoundingRect.top;

      if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) return;
      if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) return;

      moveTask(item.id, sourceColumnId, columnId, hoverIndex);

      item.index = hoverIndex;
      item.sourceColumnId = columnId;
    },
  });

  drag(drop(ref));

  return {
    ref,
    isDragging,
  };
};
