import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Column from "@/components/Column/Column";
import { BoardProvider } from "@/contexts/BoardContext";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

jest.mock("react-dnd");
jest.mock("react-dnd-html5-backend");

const mockCreateTask = jest.fn();

jest.mock("@/contexts/BoardContext", () => ({
  ...jest.requireActual("@/contexts/BoardContext"),
  useBoard: () => ({
    tasks: {
      "task-1": { id: "task-1", content: "Task 1" },
      "task-2": { id: "task-2", content: "Task 2" },
    },
    createTask: mockCreateTask,
    moveTask: jest.fn(),
    updateTask: jest.fn(),
    deleteTask: jest.fn(),
    activeEditors: {},
    activeMovings: {},
    startEditingTask: jest.fn(),
    stopEditingTask: jest.fn(),
    startMovingTask: jest.fn(),
    stopMovingTask: jest.fn(),
  }),
}));

const mockColumn = {
  id: "column-1",
  title: "Test Column",
  taskIds: ["task-1", "task-2"],
};

const renderColumnWithDnd = (column: any) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      <BoardProvider>
        <Column column={column} />
      </BoardProvider>
    </DndProvider>
  );
};

describe("Column Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders column title and tasks count correctly", () => {
    renderColumnWithDnd(mockColumn);
    expect(screen.getByText("Test Column")).toBeInTheDocument();
    expect(screen.getByText("2 tasks")).toBeInTheDocument();
  });

  test("renders all tasks in the column", () => {
    renderColumnWithDnd(mockColumn);
    expect(screen.getByText("Task 1")).toBeInTheDocument();
    expect(screen.getByText("Task 2")).toBeInTheDocument();
  });

  test("shows add task form when add button is clicked", () => {
    renderColumnWithDnd(mockColumn);

    fireEvent.click(screen.getByText("+ Add task"));

    expect(screen.getByPlaceholderText("Task content...")).toBeInTheDocument();
    expect(screen.getByText("Add")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("creates new task when form is submitted", () => {
    renderColumnWithDnd(mockColumn);

    fireEvent.click(screen.getByText("+ Add task"));
    const input = screen.getByPlaceholderText("Task content...");
    fireEvent.change(input, { target: { value: "New task content" } });
    fireEvent.click(screen.getByText("Add"));

    expect(mockCreateTask).toHaveBeenCalledWith("column-1", "New task content");
  });

  test("cancels task creation when cancel button is clicked", () => {
    renderColumnWithDnd(mockColumn);

    fireEvent.click(screen.getByText("+ Add task"));
    fireEvent.click(screen.getByText("Cancel"));

    expect(
      screen.queryByPlaceholderText("Task content...")
    ).not.toBeInTheDocument();
  });
});
