import React from "react";
import { render, screen } from "@testing-library/react";
import UserPresence from "@/components/UserPresence/UserPresence";

jest.mock("react-dnd");
jest.mock("react-dnd-html5-backend");

jest.mock("@/contexts/BoardContext", () => ({
  ...jest.requireActual("@/contexts/BoardContext"),
  useBoard: () => ({
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
  }),
}));

const renderUsersWithDnd = () => {
  return render(<UserPresence />);
};

describe("UserPresence Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders users content correctly", () => {
    renderUsersWithDnd();
    expect(screen.getByText("User 1")).toBeInTheDocument();
    expect(screen.getByText("User 2")).toBeInTheDocument();
  });

  test("renders user activity correctly", () => {
    renderUsersWithDnd();
    expect(screen.getByText("Editing: Task 1...")).toBeInTheDocument();
    expect(screen.getByText("Online")).toBeInTheDocument();
    expect(screen.getByText("Moving: Task 2...")).toBeInTheDocument();
  });
});
