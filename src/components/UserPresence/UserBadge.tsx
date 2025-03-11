/**
 * Displays a badge with the user's name and activity status for quick identification.
 */

import React from "react";
import UserActivity from "./UserActivity";

interface UserBadgeProps {
  user: {
    userId: string;
    username: string;
  };
}

const UserBadge: React.FC<UserBadgeProps> = ({ user }) => {
  return (
    <div className="flex items-center bg-blue-700 px-3 py-1 rounded-full">
      <div className="w-3 h-3 bg-green-400 rounded-full mr-2"></div>
      <span className="text-sm mr-1">{user.username}</span>
      <span className="text-xs opacity-75">
        <UserActivity userId={user.userId} />
      </span>
    </div>
  );
};

export default UserBadge;
