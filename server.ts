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

    // When a user joins the board
    socket.on(
      "join-board",
      (userData: { userId: string; username: string }) => {
        const user: User = {
          socketId: socket.id,
          userId: userData.userId,
          username: userData.username,
        };

        // Add user to the list
        connectedUsers = connectedUsers.filter(
          (u) => u.userId !== userData.userId
        );
        connectedUsers.push(user);

        // Send the current board state to the user
        socket.emit("board-update", boardState);

        // Notify all users about the new user joining the board (including the user itself)
        io.emit("user-connected", connectedUsers);
      }
    );

    // When a user updates the board
    socket.on("board-update", (update: Partial<BoardState>) => {
      // Update the board state
      if (update.tasks) boardState.tasks = update.tasks;
      if (update.columns) boardState.columns = update.columns;

      // Transmit the updated board state to all users except the sender
      socket.broadcast.emit("board-update", update);
    });

    // When a user starts editing a task
    socket.on(
      "task-editing",
      ({ userId, taskId }: { userId: string; taskId: string }) => {
        io.emit("task-editing", { userId, taskId });
      }
    );

    // When a user stops editing a task
    socket.on("task-editing-stopped", ({ taskId }: { taskId: string }) => {
      io.emit("task-editing-stopped", { taskId });
    });

    // When a user starts moving a task
    socket.on(
      "task-moving",
      ({ userId, taskId }: { userId: string; taskId: string }) => {
        io.emit("task-moving", { userId, taskId });
      }
    );

    // When a user stops moving a task
    socket.on("task-moving-stopped", ({ taskId }: { taskId: string }) => {
      io.emit("task-moving-stopped", { taskId });
    });

    // When a user disconnects
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);

      // Remove the user from the list
      connectedUsers = connectedUsers.filter(
        (user) => user.socketId !== socket.id
      );

      // Notify all users about the user disconnecting from the board
      io.emit("user-connected", connectedUsers);
    });
  });

  const PORT = process.env.PORT || 3001;
  server.listen(PORT, () => {
    console.log(`WebSocket server running on port ${PORT}`);
  });
});
