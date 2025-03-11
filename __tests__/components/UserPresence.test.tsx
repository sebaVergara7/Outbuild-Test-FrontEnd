import React from "react";
import { render, screen } from "@testing-library/react";
import UserPresence from "@/components/UserPresence/UserPresence";
import { useBoard } from "@/contexts/BoardContext";

// Mock del contexto
jest.mock("@/contexts/BoardContext", () => ({
  useBoard: jest.fn(),
}));

// Datos mock predeterminados
const defaultMockData = {
  connectedUsers: [
    { userId: "user-1", username: "User 1" },
    { userId: "user-2", username: "User 2" },
    { userId: "user-3", username: "User 3" },
  ],
  activeEditors: {
    "task-1": "user-1",
  },
  activeMovings: {
    "task-2": "user-2",
  },
  tasks: {
    "task-1": { id: "task-1", content: "Task 1" },
    "task-2": { id: "task-2", content: "Task 2" },
  },
};

// Helper function to render the component
const renderUserPresence = (contextOverrides = {}) => {
  (useBoard as jest.Mock).mockReturnValue({
    ...defaultMockData,
    ...contextOverrides,
  });

  return render(<UserPresence />);
};

describe("UserPresence Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders all connected users correctly", () => {
    renderUserPresence();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 2")).toBeInTheDocument();
    expect(screen.getByText("User 3")).toBeInTheDocument();
  });

  test("renders user activity correctly", () => {
    renderUserPresence();
    expect(screen.getByText("Editing: Task 1...")).toBeInTheDocument();
    expect(screen.getByText("Moving: Task 2...")).toBeInTheDocument();
  });

  test("shows 'Online' status for users with no activity", () => {
    renderUserPresence();
    // User 3 has no activity, should show as Online
    const userElements = screen.getAllByText("Online");
    expect(userElements.length).toBe(1);
  });

  test("handles empty user list", () => {
    renderUserPresence({ connectedUsers: [] });
    expect(screen.getByText("No users connected")).toBeInTheDocument();
  });

  test("handles missing task information gracefully", () => {
    renderUserPresence({
      activeEditors: { "non-existent-task": "user-1" },
      tasks: { "task-2": { id: "task-2", content: "Task 2" } },
    });

    // Should still render the user even if task doesn't exist
    expect(screen.getByText("User 1")).toBeInTheDocument();
    // Should not crash when task doesn't exist
    expect(screen.queryByText("Editing: undefined...")).not.toBeInTheDocument();
  });
});
