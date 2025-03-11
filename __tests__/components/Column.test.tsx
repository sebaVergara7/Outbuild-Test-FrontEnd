import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Column from "@/components/Column/Column";
import { BoardProvider, useBoard } from "@/contexts/BoardContext";

// Mocks
jest.mock("@/contexts/BoardContext", () => ({
  BoardProvider: ({ children }: { children: React.ReactNode }) => children,
  useBoard: jest.fn(),
}));

jest.mock("react-dnd");

const mockCreateTask = jest.fn();
const mockMoveTask = jest.fn();
const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockStartEditingTask = jest.fn();
const mockStopEditingTask = jest.fn();
const mockStartMovingTask = jest.fn();
const mockStopMovingTask = jest.fn();

const defaultBoardContext = {
  tasks: {
    "task-1": { id: "task-1", content: "Task 1" },
    "task-2": { id: "task-2", content: "Task 2" },
  },
  createTask: mockCreateTask,
  moveTask: mockMoveTask,
  updateTask: mockUpdateTask,
  deleteTask: mockDeleteTask,
  activeEditors: {},
  activeMovings: {},
  startEditingTask: mockStartEditingTask,
  stopEditingTask: mockStopEditingTask,
  startMovingTask: mockStartMovingTask,
  stopMovingTask: mockStopMovingTask,
};

const defaultColumn = {
  id: "column-1",
  title: "Test Column",
  taskIds: ["task-1", "task-2"],
};

// Helper function to render Column component
const renderColumn = (column = defaultColumn, contextOverrides = {}) => {
  (useBoard as jest.Mock).mockReturnValue({
    ...defaultBoardContext,
    ...contextOverrides,
  });

  return render(
    <BoardProvider>
      <Column column={column} />
    </BoardProvider>
  );
};

describe("Column Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders column title, tasks count, and tasks correctly", () => {
    renderColumn();
    expect(screen.getByText("Test Column")).toBeInTheDocument();
    expect(screen.getByText("2 tasks")).toBeInTheDocument();
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("handles add task form interactions correctly", () => {
    renderColumn();

    fireEvent.click(screen.getByText("+ Add task"));
    expect(screen.getByPlaceholderText("Task content...")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    const input = screen.getByPlaceholderText("Task content...");
    fireEvent.change(input, { target: { value: "New task content" } });
    fireEvent.click(screen.getByText("Add"));
    expect(mockCreateTask).toHaveBeenCalledWith("column-1", "New task content");

    fireEvent.click(screen.getByText("+ Add task"));
    fireEvent.click(screen.getByText("Cancel"));
    expect(
      screen.queryByPlaceholderText("Task content...")
    ).not.toBeInTheDocument();
  });

  test("shows correct task count message based on number of tasks", () => {
    renderColumn({ ...defaultColumn, taskIds: ["task-1"] });
    expect(screen.getByText("1 tasks")).toBeInTheDocument();

    renderColumn({ ...defaultColumn, taskIds: [] });
    expect(screen.getByText("0 tasks")).toBeInTheDocument();
  });
});
