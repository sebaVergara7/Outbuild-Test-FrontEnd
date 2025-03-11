import React from "react";
import { render, screen } from "@testing-library/react";
import Board from "@/components/Board/Board";
import { BoardProvider, useBoard } from "@/contexts/BoardContext";

// Mocks
const defaultMockBoardContext = {
  connectedUsers: [
    { userId: "user-1", username: "User 1" },
    { userId: "user-2", username: "User 2" },
  ],
  tasks: {
    "task-1": { id: "task-1", content: "Task 1" },
    "task-2": { id: "task-2", content: "Task 2" },
  },
  activeEditors: {
    "task-1": "user-1",
  },
  activeMovings: {
    "task-2": "user-2",
  },
  columns: {
    "column-1": { id: "column-1", title: "Column 1", taskIds: [] },
    "column-2": { id: "column-2", title: "Column 2", taskIds: [] },
  },
};

jest.mock("@/contexts/BoardContext", () => ({
  BoardProvider: ({ children }: { children: React.ReactNode }) => children,
  useBoard: jest.fn(),
}));

jest.mock("react-dnd");
jest.mock("react-dnd-html5-backend");

const renderBoard = (customContext = {}) => {
  (useBoard as jest.Mock).mockReturnValue({
    ...defaultMockBoardContext,
    ...customContext,
  });

  return render(
    <BoardProvider>
      <Board />
    </BoardProvider>
  );
};

describe("Board Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders board title correctly", () => {
    renderBoard();
    expect(screen.getByText("Collaborative Task Board")).toBeInTheDocument();
  });

  test("renders the correct number of columns", () => {
    renderBoard();
    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();
  });

  test("renders with custom column data", () => {
    renderBoard({
      columns: {
        "column-1": { id: "column-1", title: "Backlog", taskIds: [] },
        "column-2": { id: "column-2", title: "In Progress", taskIds: [] },
        "column-3": { id: "column-3", title: "Done", taskIds: [] },
      },
    });

    expect(screen.getByText("Backlog")).toBeInTheDocument();
    expect(screen.getByText("In Progress")).toBeInTheDocument();
    expect(screen.getByText("Done")).toBeInTheDocument();
  });
});
