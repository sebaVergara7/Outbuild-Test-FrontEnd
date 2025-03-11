import React from "react";
import { UserActivityProps, useUserActivity } from "@/hooks/useUserActivity";

const UserActivity: React.FC<UserActivityProps> = ({ userId }) => {
  const userActivity = useUserActivity({ userId });

  return <>{userActivity}</>;
};

export default UserActivity;
