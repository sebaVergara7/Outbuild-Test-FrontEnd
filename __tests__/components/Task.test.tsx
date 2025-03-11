import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import Task from "@/components/Task/Task";
import { BoardProvider, useBoard } from "@/contexts/BoardContext";
import formatDate from "@/utils/dateUtils";

// Mocks
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

jest.mock("@/contexts/BoardContext", () => ({
  BoardProvider: ({ children }: { children: React.ReactNode }) => children,
  useBoard: jest.fn(),
}));

jest.mock("react-dnd");

const mockUpdateTask = jest.fn();
const mockDeleteTask = jest.fn();
const mockMoveTask = jest.fn();
const mockStartEditingTask = jest.fn();
const mockStopEditingTask = jest.fn();
const mockStartMovingTask = jest.fn();
const mockStopMovingTask = jest.fn();

// Default board context with mock functions
const defaultBoardContext = {
  moveTask: mockMoveTask,
  updateTask: mockUpdateTask,
  deleteTask: mockDeleteTask,
  activeEditors: { "task-2": "other-user-id" },
  activeMovings: { "task-3": "other-user-id" },
  startEditingTask: mockStartEditingTask,
  stopEditingTask: mockStopEditingTask,
  startMovingTask: mockStartMovingTask,
  stopMovingTask: mockStopMovingTask,
};

// Helper function to render the component
const renderTask = (
  task = mockTasks[0],
  columnId = "column-1",
  index = 0,
  contextOverrides = {}
) => {
  (useBoard as jest.Mock).mockReturnValue({
    ...defaultBoardContext,
    ...contextOverrides,
  });

  return render(
    <BoardProvider>
      <Task task={task} columnId={columnId} index={index} />
    </BoardProvider>
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

  test("renders task content and handles edit form interactions correctly", () => {
    renderTask();
    expect(screen.getByText("Test task content")).toBeInTheDocument();

    // Click on the edit button
    fireEvent.click(screen.getByText("Edit"));

    // Verify that the form is displayed
    expect(screen.getByRole("textbox")).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
    expect(screen.getByText("Cancel")).toBeInTheDocument();

    // Change the content
    const textbox = screen.getByRole("textbox");
    fireEvent.change(textbox, { target: { value: "Updated content" } });

    // Save changes
    fireEvent.click(screen.getByText("Save"));

    // Verify that updateTask was called with the correct parameters
    expect(mockUpdateTask).toHaveBeenCalledWith("task-1", "Updated content");

    // Click on the edit button again
    fireEvent.click(screen.getByText("Edit"));

    // Click cancel
    fireEvent.click(screen.getByText("Cancel"));

    // Verify that we're back to view mode
    expect(screen.queryByRole("textbox")).not.toBeInTheDocument();
    expect(screen.getByText("Edit")).toBeInTheDocument();
  });

  test("deletes task when delete button is clicked", () => {
    renderTask();

    // Click on the delete button
    fireEvent.click(screen.getByText("Delete"));

    // Verify that deleteTask was called with the correct ID
    expect(mockDeleteTask).toHaveBeenCalledWith("task-1");
  });

  test("shows indications when task is being edited or moved by another user", () => {
    renderTask(mockTasks[1]);

    // Verify that the indicator is displayed
    expect(
      screen.getByText("Being edited by another user")
    ).toBeInTheDocument();

    // Verify that the buttons are disabled
    screen.getAllByText("Edit").forEach((button) => {
      expect(button).toBeDisabled();
    });
    screen.getAllByText("Delete").forEach((button) => {
      expect(button).toBeDisabled();
    });

    renderTask(mockTasks[2]);

    // Verify that the indicator is displayed
    expect(screen.getByText("Being moved by another user")).toBeInTheDocument();

    // Verify that the buttons are disabled
    screen.getAllByText("Edit").forEach((button) => {
      expect(button).toBeDisabled();
    });
    screen.getAllByText("Delete").forEach((button) => {
      expect(button).toBeDisabled();
    });
  });

  test("shows formatted creation date", () => {
    const taskWithRecentDate = {
      ...mockTasks[0],
      createdAt: new Date().toISOString(),
    };

    renderTask(taskWithRecentDate);

    expect(
      screen.getByText(formatDate(taskWithRecentDate.createdAt))
    ).toBeInTheDocument();
  });
});
