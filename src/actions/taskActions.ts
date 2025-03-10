import { Socket } from "socket.io-client";
import { v4 as uuidv4 } from "uuid";
import { Column, Task } from "@/contexts/BoardContext";

export const createTask = (
  columnId: string,
  content: string,
  columns: Record<string, Column>,
  setColumns: React.Dispatch<React.SetStateAction<Record<string, Column>>>,
  tasks: Record<string, Task>,
  setTasks: React.Dispatch<React.SetStateAction<Record<string, Task>>>,
  socket: Socket
): string => {
  const newTaskId = uuidv4();
  const newTask = {
    id: newTaskId,
    content,
    createdAt: new Date().toISOString(),
  };

  const newTasks = {
    ...tasks,
    [newTaskId]: newTask,
  };

  const newColumns = {
    ...columns,
    [columnId]: {
      ...columns[columnId],
      taskIds: [...columns[columnId].taskIds, newTaskId],
    },
  };

  setTasks(newTasks);
  setColumns(newColumns);

  if (socket) {
    socket.emit("board-update", {
      tasks: newTasks,
      columns: newColumns,
    });
  }

  return newTaskId;
};

export const updateTask = (
  taskId: string,
  content: string,
  tasks: Record<string, any>,
  setTasks: (tasks: Record<string, any>) => void,
  socket: any
) => {
  if (!tasks[taskId]) return;

  const updatedTask = {
    ...tasks[taskId],
    content,
    updatedAt: new Date().toISOString(),
  };

  const newTasks = {
    ...tasks,
    [taskId]: updatedTask,
  };

  setTasks(newTasks);

  if (socket) {
    socket.emit("board-update", { tasks: newTasks });
  }
};

export const deleteTask = (
  taskId: string,
  columns: Record<string, any>,
  setColumns: (columns: Record<string, any>) => void,
  tasks: Record<string, any>,
  setTasks: (tasks: Record<string, any>) => void,
  socket: any
) => {
  if (!tasks[taskId]) return;

  const columnId = Object.keys(columns).find((colId) =>
    columns[colId].taskIds.includes(taskId)
  );

  if (!columnId) return;

  const newColumns = {
    ...columns,
    [columnId]: {
      ...columns[columnId],
      taskIds: columns[columnId].taskIds.filter((id: string) => id !== taskId),
    },
  };

  const newTasks = { ...tasks };
  delete newTasks[taskId];

  setColumns(newColumns);
  setTasks(newTasks);

  if (socket) {
    socket.emit("board-update", {
      tasks: newTasks,
      columns: newColumns,
    });
  }
};

export const moveTask = (
  taskId: string,
  sourceColumnId: string,
  destinationColumnId: string,
  newIndex: number,
  columns: Record<string, any>,
  setColumns: (columns: Record<string, any>) => void,
  socket: any
) => {
  if (sourceColumnId === destinationColumnId) {
    const column = columns[sourceColumnId];
    const taskIds = Array.from(column.taskIds);
    const currentIndex = taskIds.indexOf(taskId);

    taskIds.splice(currentIndex, 1);
    taskIds.splice(newIndex, 0, taskId);

    const newColumns = {
      ...columns,
      [sourceColumnId]: {
        ...column,
        taskIds,
      },
    };

    setColumns(newColumns);
    if (socket) {
      socket.emit("board-update", { columns: newColumns });
    }
    return;
  }

  const sourceColumn = columns[sourceColumnId];
  const destColumn = columns[destinationColumnId];

  const sourceTaskIds = Array.from(sourceColumn.taskIds);
  const destTaskIds = Array.from(destColumn.taskIds);

  sourceTaskIds.splice(sourceTaskIds.indexOf(taskId), 1);
  destTaskIds.splice(newIndex, 0, taskId);

  const newColumns = {
    ...columns,
    [sourceColumnId]: {
      ...sourceColumn,
      taskIds: sourceTaskIds,
    },
    [destinationColumnId]: {
      ...destColumn,
      taskIds: destTaskIds,
    },
  };

  setColumns(newColumns);
  if (socket) {
    socket.emit("board-update", { columns: newColumns });
  }
};

export const startEditingTask = (taskId: string, socket: any) => {
  const userId = localStorage.getItem("userId");
  if (socket) {
    socket.emit("task-editing", { userId, taskId });
  }
};

export const stopEditingTask = (taskId: string, socket: any) => {
  if (socket) {
    socket.emit("task-editing-stopped", { taskId });
  }
};

export const startMovingTask = (taskId: string, socket: any) => {
  const userId = localStorage.getItem("userId");
  if (socket) {
    socket.emit("task-moving", { userId, taskId });
  }
};

export const stopMovingTask = (taskId: string, socket: any) => {
  if (socket) {
    socket.emit("task-moving-stopped", { taskId });
  }
};
