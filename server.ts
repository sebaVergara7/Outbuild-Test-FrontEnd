import http from "http";
import { Server } from "socket.io";
import next from "next";

const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  const server = http.createServer((req, res) => {
    handle(req, res);
  });

  const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000",
      methods: ["GET", "POST"],
    },
  });

  interface Task {
    id: string;
    content: string;
    createdAt: string;
    updatedAt?: string;
  }

  interface Column {
    id: string;
    title: string;
    taskIds: string[];
  }

  interface BoardState {
    tasks: Record<string, Task>;
    columns: Record<string, Column>;
  }

  const boardState: BoardState = {
    tasks: {},
    columns: {
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
    },
  };

  interface User {
    socketId: string;
    userId: string;
    username: string;
  }

  let connectedUsers: User[] = [];

  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Cuando un usuario se une al tablero
    socket.on(
      "join-board",
      (userData: { userId: string; username: string }) => {
        const user: User = {
          socketId: socket.id,
          userId: userData.userId,
          username: userData.username,
        };

        // Agregar usuario a la lista
        connectedUsers = connectedUsers.filter(
          (u) => u.userId !== userData.userId
        );
        connectedUsers.push(user);

        // Enviar el estado actual del tablero al usuario
        socket.emit("board-update", boardState);

        // Notificar a todos los usuarios sobre el nuevo usuario que se une al tablero (incluyendo al usuario mismo)
        io.emit("user-connected", connectedUsers);
      }
    );

    // Cuando un usuario actualiza el tablero
    socket.on("board-update", (update: Partial<BoardState>) => {
      // Actualizar el estado del tablero
      if (update.tasks) boardState.tasks = update.tasks;
      if (update.columns) boardState.columns = update.columns;

      // Transmitir el estado actualizado del tablero a todos los usuarios excepto el remitente
      socket.broadcast.emit("board-update", update);
    });

    // Cuando un usuario comienza a editar una tarea
    socket.on(
      "task-editing",
      ({ userId, taskId }: { userId: string; taskId: string }) => {
        io.emit("task-editing", { userId, taskId });
      }
    );

    // Cuando un usuario deja de editar una tarea
    socket.on("task-editing-stopped", ({ taskId }: { taskId: string }) => {
      io.emit("task-editing-stopped", { taskId });
    });

    // Cuando un usuario comienza a mover una tarea
    socket.on(
      "task-moving",
      ({ userId, taskId }: { userId: string; taskId: string }) => {
        io.emit("task-moving", { userId, taskId });
      }
    );

    // Cuando un usuario deja de mover una tarea
    socket.on("task-moving-stopped", ({ taskId }: { taskId: string }) => {
      io.emit("task-moving-stopped", { taskId });
    });

    // Cuando un usuario se desconecta
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Eliminar al usuario de la lista
      connectedUsers = connectedUsers.filter(
        (user) => user.socketId !== socket.id
      );

      // Notificar a todos los usuarios sobre el usuario que se desconecta del tablero
      io.emit("user-connected", connectedUsers);
    });
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
  });
});
