/**
 * Custom hook to initialize and manage a socket connection.
 */

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

let socket: Socket | null = null;

export const useSocket = () => {
  const [socketInstance, setSocketInstance] = useState<Socket | null>(null);

  useEffect(() => {
    // Create socket only once
    if (!socket) {
      socket = io("http://localhost:3001");
    }

    setSocketInstance(socket);

    return () => {
      // Do not disconnect to keep the connection while the app is open
    };
  }, []);

  return socketInstance;
};
