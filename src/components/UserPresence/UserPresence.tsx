import React from "react";
import { useBoard } from "@/contexts/BoardContext";
import UserBadge from "./UserBadge";

const UserPresence: React.FC = () => {
  const { connectedUsers } = useBoard();

  return (
    <div className="mt-2 flex flex-wrap gap-1">
      {connectedUsers.map((user) => (
        <UserBadge key={user.userId} user={user} />
      ))}
    </div>
  );
};

export default UserPresence;
