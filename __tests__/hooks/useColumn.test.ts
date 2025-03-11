import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useColumn, ColumnProps } from "@/hooks/useColumn";
import { useDrop } from "react-dnd";
import React from "react";

// Mocks
const mockTasks = {
  "task-1": { id: "task-1", content: "Task 1" },
  "task-2": { id: "task-2", content: "Task 2" },
};

const createTask = jest.fn();
const moveTask = jest.fn();

type DropFunction = (item: any, monitor?: any) => void;
let dropCallback: DropFunction;
jest.mock("react-dnd", () => ({
  useDrop: jest.fn((config) => {
    dropCallback = config.drop;
    return [{ isOver: false }, jest.fn()];
  }),
}));

jest.mock("@/contexts/BoardContext", () => ({
  useBoard: () => ({
    tasks: mockTasks,
    createTask,
    moveTask,
  }),
}));

describe("useColumn Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockColumn = (
    id: string,
    title: string,
    taskIds: string[]
  ): ColumnProps => ({
    column: { id, title, taskIds },
  });

  test("should initialize with correct values", () => {
    const mockColumnProps = createMockColumn("column-1", "To Do", [
      "task-1",
      "task-2",
    ]);

    const { result } = renderHook(() => useColumn(mockColumnProps));

    expect(result.current.isAddingTask).toBe(false);
    expect(result.current.newTaskContent).toBe("");
    expect(result.current.tasks).toEqual(mockTasks);
    expect(result.current.isOver).toBe(false);
    expect(result.current.ref).not.toBeNull();
  });

  test("should create task when handleAddTask is called with valid content", () => {
    const mockColumnProps = createMockColumn("column-1", "To Do", [
      "task-1",
      "task-2",
    ]);

    const { result } = renderHook(() => useColumn(mockColumnProps));

    // Set task content
    act(() => {
      result.current.setNewTaskContent("New task");
    });

    // Add the task
    act(() => {
      result.current.handleAddTask();
    });

    expect(createTask).toHaveBeenCalledWith("column-1", "New task");
    expect(result.current.newTaskContent).toBe("");
    expect(result.current.isAddingTask).toBe(false);
  });

  test("should not create task when content is empty", () => {
    const mockColumnProps = createMockColumn("column-1", "To Do", [
      "task-1",
      "task-2",
    ]);

    const { result } = renderHook(() => useColumn(mockColumnProps));

    // Try with whitespace
    act(() => {
      result.current.setNewTaskContent("   ");
      result.current.handleAddTask();
    });

    expect(createTask).not.toHaveBeenCalled();
  });

  test("should reset state when handleCancelAddTask is called", () => {
    const mockColumnProps = createMockColumn("column-1", "To Do", [
      "task-1",
      "task-2",
    ]);

    const { result } = renderHook(() => useColumn(mockColumnProps));

    // Set up state
    act(() => {
      result.current.setIsAddingTask(true);
      result.current.setNewTaskContent("Task content");
    });

    // Cancel adding task
    act(() => {
      result.current.handleCancelAddTask();
    });

    expect(result.current.isAddingTask).toBe(false);
    expect(result.current.newTaskContent).toBe("");
  });

  test("should call drop with ref.current when ref is set", () => {
    // Configurations for useDrop
    const mockDrop = jest.fn();
    (useDrop as jest.Mock).mockReturnValue([{ isOver: false }, mockDrop]);

    const mockColumnProps = createMockColumn("column-1", "To Do", [
      "task-1",
      "task-2",
    ]);

    // Mock for HTMLDivElement
    const mockDiv = document.createElement("div");
    const mockRef = { current: mockDiv };

    // Mock useRef to return our mock
    jest.spyOn(React, "useRef").mockReturnValue(mockRef);

    renderHook(() => useColumn(mockColumnProps));

    // Verificar que drop fue llamado con ref.current
    expect(mockDrop).toHaveBeenCalledWith(mockDiv);
  });

  test("should handle drop from another column", () => {
    const mockColumnProps = createMockColumn("column-1", "To Do", [
      "task-1",
      "task-2",
    ]);

    renderHook(() => useColumn(mockColumnProps));

    // Execute drop callback manually
    const mockItem = {
      id: "task-3",
      sourceColumnId: "column-2",
      index: 0,
    };

    dropCallback(mockItem);

    expect(moveTask).toHaveBeenCalledWith("task-3", "column-2", "column-1", 2);
  });

  test("should not move task if source and destination columns are the same", () => {
    const mockColumnProps = createMockColumn("column-1", "To Do", [
      "task-1",
      "task-2",
    ]);

    renderHook(() => useColumn(mockColumnProps));

    // Execute drop callback manually with the same columnId
    const mockItem = {
      id: "task-1",
      sourceColumnId: "column-1",
      index: 0,
    };

    dropCallback(mockItem);

    // Should not call moveTask because it's the same column
    expect(moveTask).not.toHaveBeenCalled();
  });
});
