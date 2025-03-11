/**
 * Header component for the Kanban board displaying the application title and user presence information.
 */

import React from "react";
import UserPresence from "@/components/UserPresence/UserPresence";

const BoardHeader: React.FC = () => {
  return (
    <header className="bg-blue-500 text-white p-3">
      <h1 className="text-2xl font-bold">Collaborative Task Board</h1>
      <UserPresence />
    </header>
  );
};

export default BoardHeader;
