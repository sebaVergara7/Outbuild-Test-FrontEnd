import { Socket } from "socket.io-client";
import { Column, Task, User } from "@/contexts/BoardContext";

export const handleSocketEvents = (
  socket: Socket,
  setColumns: React.Dispatch<React.SetStateAction<Record<string, Column>>>,
  setTasks: React.Dispatch<React.SetStateAction<Record<string, Task>>>,
  setConnectedUsers: React.Dispatch<React.SetStateAction<User[]>>,
  setActiveEditors: React.Dispatch<
    React.SetStateAction<Record<string, string>>
  >,
  setActiveMovings: React.Dispatch<React.SetStateAction<Record<string, string>>>
) => {
  socket.on("board-update", (data: any) => {
    if (data.columns) setColumns(data.columns);
    if (data.tasks) setTasks(data.tasks);
  });

  socket.on("user-connected", (users: any) => {
    setConnectedUsers(users);
  });

  socket.on("task-editing", ({ userId, taskId }: Record<string, string>) => {
    setActiveEditors((prev) => ({
      ...prev,
      [taskId]: userId,
    }));
  });

  socket.on("task-editing-stopped", ({ taskId }: { taskId: string }) => {
    setActiveEditors((prev) => {
      const newEditors = { ...prev };
      delete newEditors[taskId];
      return newEditors;
    });
  });

  socket.on("task-moving", ({ userId, taskId }: Record<string, string>) => {
    setActiveMovings((prev) => ({
      ...prev,
      [taskId]: userId,
    }));
  });

  socket.on("task-moving-stopped", ({ taskId }: { taskId: string }) => {
    setActiveMovings((prev) => {
      const newMovings = { ...prev };
      delete newMovings[taskId];
      return newMovings;
    });
  });
};
