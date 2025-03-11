/**
 * Provides the board context, managing tasks, columns, and user interactions in real time.
 */

import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  ReactNode,
} from "react";
import { v4 as uuidv4 } from "uuid";
import { useSocket } from "@/hooks/useSocket";
import {
  createTask,
  updateTask,
  deleteTask,
  moveTask,
  startEditingTask,
  stopEditingTask,
  startMovingTask,
  stopMovingTask,
} from "@/actions/taskActions";
import { handleSocketEvents } from "@/handlers/socketHandlers";

export interface Task {
  id: string;
  content: string;
  createdAt: string;
  updatedAt?: string;
}

export interface Column {
  id: string;
  title: string;
  taskIds: string[];
}

export interface User {
  userId: string;
  username: string;
}

export interface BoardContextType {
  columns: Record<string, Column>;
  tasks: Record<string, Task>;
  connectedUsers: User[];
  activeEditors: Record<string, string>;
  activeMovings: Record<string, string>;
  createTask: (columnId: string, content: string) => string;
  updateTask: (taskId: string, content: string) => void;
  deleteTask: (taskId: string) => void;
  moveTask: (
    taskId: string,
    sourceColumnId: string,
    destinationColumnId: string,
    newIndex: number
  ) => void;
  startEditingTask: (taskId: string) => void;
  stopEditingTask: (taskId: string) => void;
  startMovingTask: (taskId: string) => void;
  stopMovingTask: (taskId: string) => void;
}

const BoardContext = createContext<BoardContextType | undefined>(undefined);

interface BoardProviderProps {
  children: ReactNode;
}

export const BoardProvider = ({ children }: BoardProviderProps) => {
  const [columns, setColumns] = useState<Record<string, Column>>({
    "to-do": {
      id: "to-do",
      title: "To Do",
      taskIds: [],
    },
    "in-progress": {
      id: "in-progress",
      title: "In Progress",
      taskIds: [],
    },
    done: {
      id: "done",
      title: "Done",
      taskIds: [],
    },
  });

  const [tasks, setTasks] = useState<Record<string, Task>>({});
  const [connectedUsers, setConnectedUsers] = useState<User[]>([]);
  const [activeEditors, setActiveEditors] = useState<Record<string, string>>(
    {}
  );
  const [activeMovings, setActiveMovings] = useState<Record<string, string>>(
    {}
  );
  const socket = useSocket();

  useEffect(() => {
    if (!socket) return;

    handleSocketEvents(
      socket,
      setColumns,
      setTasks,
      setConnectedUsers,
      setActiveEditors,
      setActiveMovings
    );

    // Send user information when connecting
    socket.emit("join-board", {
      userId: localStorage.getItem("userId") || uuidv4(),
      username:
        localStorage.getItem("username") ||
        `User-${Math.floor(Math.random() * 1000)}`,
    });

    return () => {
      socket.off("board-update");
      socket.off("user-connected");
      socket.off("task-editing");
      socket.off("task-editing-stopped");
    };
  }, [socket]);

  return (
    <BoardContext.Provider
      value={{
        columns,
        tasks,
        connectedUsers,
        activeEditors,
        activeMovings,
        createTask: (columnId, content) =>
          createTask(
            columnId,
            content,
            columns,
            setColumns,
            tasks,
            setTasks,
            socket
          ),
        updateTask: (taskId, content) =>
          updateTask(taskId, content, tasks, setTasks, socket),
        deleteTask: (taskId) =>
          deleteTask(taskId, columns, setColumns, tasks, setTasks, socket),
        moveTask: (taskId, sourceColumnId, destinationColumnId, newIndex) =>
          moveTask(
            taskId,
            sourceColumnId,
            destinationColumnId,
            newIndex,
            columns,
            setColumns,
            socket
          ),
        startEditingTask: (taskId) => startEditingTask(taskId, socket),
        stopEditingTask: (taskId) => stopEditingTask(taskId, socket),
        startMovingTask: (taskId) => startMovingTask(taskId, socket),
        stopMovingTask: (taskId) => stopMovingTask(taskId, socket),
      }}
    >
      {children}
    </BoardContext.Provider>
  );
};

export const useBoard = () => {
  const context = useContext(BoardContext);
  if (context === undefined) {
    throw new Error("useBoard must be used within a BoardProvider");
  }
  return context;
};
