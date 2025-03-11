import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useTask, TaskProps } from "@/hooks/useTask";

// Mocks
const mockLocalStorage: Record<string, string> = {
  userId: "current-user-id",
};

const updateTask = jest.fn();
const deleteTask = jest.fn();
const startEditingTask = jest.fn();
const stopEditingTask = jest.fn();

jest.mock("@/contexts/BoardContext", () => ({
  useBoard: () => ({
    updateTask,
    deleteTask,
    activeEditors: {
      "task-1": "other-user-id",
      "task-2": "current-user-id",
    },
    activeMovings: {
      "task-3": "other-user-id",
      "task-4": "current-user-id",
    },
    startEditingTask,
    stopEditingTask,
  }),
}));

// Mock localStorage
Object.defineProperty(window, "localStorage", {
  value: {
    getItem: jest.fn((key) => mockLocalStorage[key] || null),
    setItem: jest.fn((key, value) => {
      mockLocalStorage[key] = value;
    }),
  },
  writable: true,
});

describe("useTask Hook", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const createMockTask = (id: string, content: string): TaskProps => ({
    task: { id, content, createdAt: new Date().toISOString() },
  });

  test("should initialize with correct values", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    expect(result.current.isEditing).toBe(false);
    expect(result.current.editContent).toBe("Task content");
    expect(result.current.isBeingEditedByOther).toBe(false);
    expect(result.current.isBeingMovedByOther).toBe(false);
    expect(typeof result.current.handleSave).toBe("function");
    expect(typeof result.current.handleKeyPress).toBe("function");
    expect(result.current.deleteTask).toBe(deleteTask);
  });

  test("should update editContent when task content changes", () => {
    const initialTask = createMockTask("test-task", "Initial content");

    const { result, rerender } = renderHook((props) => useTask(props), {
      initialProps: initialTask,
    });

    expect(result.current.editContent).toBe("Initial content");

    // Update task content
    const updatedTask = createMockTask("test-task", "Updated content");
    rerender(updatedTask);

    expect(result.current.editContent).toBe("Updated content");
  });

  test("should call startEditingTask when entering edit mode", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    act(() => {
      result.current.setIsEditing(true);
    });

    expect(result.current.isEditing).toBe(true);
    expect(startEditingTask).toHaveBeenCalledWith("test-task");
  });

  test("should call stopEditingTask when exiting edit mode", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    // Start editing
    act(() => {
      result.current.setIsEditing(true);
    });

    expect(startEditingTask).toHaveBeenCalledWith("test-task");

    // Stop editing
    act(() => {
      result.current.setIsEditing(false);
    });

    expect(stopEditingTask).toHaveBeenCalledWith("test-task");
  });

  test("should call stopEditingTask on unmount if editing", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result, unmount } = renderHook(() => useTask(mockTaskProps));

    // Start editing
    act(() => {
      result.current.setIsEditing(true);
    });

    expect(startEditingTask).toHaveBeenCalledWith("test-task");

    // Unmount component while editing
    unmount();

    expect(stopEditingTask).toHaveBeenCalledWith("test-task");
  });

  test("should update task when handleSave is called with modified content", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    // Start editing and change content
    act(() => {
      result.current.setIsEditing(true);
      result.current.setEditContent("Modified content");
    });

    // Save the changes
    act(() => {
      result.current.handleSave();
    });

    expect(updateTask).toHaveBeenCalledWith("test-task", "Modified content");
    expect(result.current.isEditing).toBe(false);
  });

  test("should not update task when content is unchanged", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    // Start editing but don't change content
    act(() => {
      result.current.setIsEditing(true);
    });

    // Save without changes
    act(() => {
      result.current.handleSave();
    });

    expect(updateTask).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(false);
  });

  test("should trim whitespace when saving", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    // Start editing and add whitespace
    act(() => {
      result.current.setIsEditing(true);
      result.current.setEditContent("  Modified content  ");
    });

    // Save with whitespace
    act(() => {
      result.current.handleSave();
    });

    expect(updateTask).toHaveBeenCalledWith("test-task", "Modified content");
  });

  test("should save when Enter is pressed without Shift", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    // Start editing and change content
    act(() => {
      result.current.setIsEditing(true);
      result.current.setEditContent("Modified content");
    });

    // Simulate pressing Enter
    const mockEvent = {
      key: "Enter",
      shiftKey: false,
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    act(() => {
      result.current.handleKeyPress(mockEvent);
    });

    expect(mockEvent.preventDefault).toHaveBeenCalled();
    expect(updateTask).toHaveBeenCalledWith("test-task", "Modified content");
    expect(result.current.isEditing).toBe(false);
  });

  test("should not save when Shift+Enter is pressed", () => {
    const mockTaskProps = createMockTask("test-task", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    // Start editing and change content
    act(() => {
      result.current.setIsEditing(true);
      result.current.setEditContent("Modified content");
    });

    // Simulate pressing Shift+Enter
    const mockEvent = {
      key: "Enter",
      shiftKey: true,
      preventDefault: jest.fn(),
    } as unknown as React.KeyboardEvent<HTMLTextAreaElement>;

    act(() => {
      result.current.handleKeyPress(mockEvent);
    });

    expect(mockEvent.preventDefault).not.toHaveBeenCalled();
    expect(updateTask).not.toHaveBeenCalled();
    expect(result.current.isEditing).toBe(true);
  });

  test("should detect when task is being edited by another user", () => {
    // Task being edited by another user
    const mockTaskProps = createMockTask("task-1", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    expect(result.current.isBeingEditedByOther).toBe(true);
  });

  test("should detect when task is being moved by another user", () => {
    // Task being moved by another user
    const mockTaskProps = createMockTask("task-3", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    expect(result.current.isBeingMovedByOther).toBe(true);
  });

  test("should not detect as edited by other when current user is editor", () => {
    // Task being edited by current user
    const mockTaskProps = createMockTask("task-2", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    expect(result.current.isBeingEditedByOther).toBe(false);
  });

  test("should not detect as moved by other when current user is mover", () => {
    // Task being moved by current user
    const mockTaskProps = createMockTask("task-4", "Task content");

    const { result } = renderHook(() => useTask(mockTaskProps));

    expect(result.current.isBeingMovedByOther).toBe(false);
  });
});
