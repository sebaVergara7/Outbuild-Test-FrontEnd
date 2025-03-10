import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Task from "@/components/Task/Task";
import { BoardProvider } from "@/contexts/BoardContext";

jest.mock("react-dnd");
jest.mock("react-dnd-html5-backend");

const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();

jest.mock("@/contexts/BoardContext", () => ({
  ...jest.requireActual("@/contexts/BoardContext"),
  useBoard: () => ({
    moveTask: jest.fn(),
    updateTask: mockUpdateTask,
    deleteTask: mockDeleteTask,
    activeEditors: { "task-2": "other-user-id" },
    activeMovings: { "task-3": "other-user-id" },
    startEditingTask: jest.fn(),
    stopEditingTask: jest.fn(),
    startMovingTask: jest.fn(),
    stopMovingTask: jest.fn(),
  }),
}));

const mockTasks = [
  {
    id: "task-1",
    content: "Test task content",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "task-2",
    content: "Test task content 2",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: "task-3",
    content: "Test task content 3",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
];

const renderTaskWithDnd = (task: any, columnId = "column-1", index = 0) => {
  return render(
    <DndProvider backend={HTML5Backend}>
      <BoardProvider>
        <Task task={task} columnId={columnId} index={index} />
      </BoardProvider>
    </DndProvider>
  );
};

describe("Task Component", () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "test-user-id"),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("renders task content correctly", () => {
    renderTaskWithDnd(mockTasks[0]);
    expect(screen.getByText("Test task content")).toBeInTheDocument();
  });

  test("shows edit form when edit button is clicked", () => {
    renderTaskWithDnd(mockTasks[0]);

    // Click on the edit button
    fireEvent.click(screen.getByText("Edit"));

    // Verfy that the form is displayed
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();
  });

  test("updates task content when saved", () => {
    renderTaskWithDnd(mockTasks[0]);

    // Click on the edit button
    fireEvent.click(screen.getByText("Edit"));

    // Change the content
    const textbox = screen.getByRole("textbox");
    fireEvent.change(textbox, { target: { value: "Updated content" } });

    // Save changes
    fireEvent.click(screen.getByText("Save"));

    // Verify that updateTask was called with the correct parameters
    expect(mockUpdateTask).toHaveBeenCalledWith("task-1", "Updated content");
  });

  test("deletes task when delete button is clicked", () => {
    renderTaskWithDnd(mockTasks[0]);

    // Click on the delete button
    fireEvent.click(screen.getByText("Delete"));

    // Verify that deleteTask was called with the correct ID
    expect(mockDeleteTask).toHaveBeenCalledWith("task-1");
  });

  test("shows indication when task is being edited by another user", () => {
    renderTaskWithDnd(mockTasks[1]);

    // Verify that the indicator is displayed
    expect(
      screen.getByText("Being edited by another user")
    ).toBeInTheDocument();

    // Verify that the buttons are disabled
    expect(screen.getByText("Edit")).toBeDisabled();
    expect(screen.getByText("Delete")).toBeDisabled();
  });

  test("shows indication when task is being moved by another user", () => {
    renderTaskWithDnd(mockTasks[2]);

    // Verify that the indicator is displayed
    expect(screen.getByText("Being moved by another user")).toBeInTheDocument();

    // Verify that the buttons are disabled
    expect(screen.getByText("Edit")).toBeDisabled();
    expect(screen.getByText("Delete")).toBeDisabled();
  });
});
