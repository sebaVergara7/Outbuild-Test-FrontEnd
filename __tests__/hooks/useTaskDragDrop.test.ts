import { renderHook } from "@testing-library/react";
import { useTaskDragDrop } from "@/hooks/useTaskDragDrop";
import { useDrag, useDrop } from "react-dnd";

// Mocks
const moveTask = jest.fn();
const startMovingTask = jest.fn();
const stopMovingTask = jest.fn();

// Mock react-dnd
jest.mock("react-dnd", () => ({
  useDrag: jest.fn(),
  useDrop: jest.fn(),
}));

// Mock BoardContext
jest.mock("@/contexts/BoardContext", () => ({
  useBoard: () => ({
    moveTask,
    startMovingTask,
    stopMovingTask,
  }),
}));

describe("useTaskDragDrop Hook", () => {
  const mockTask = {
    id: "task-1",
    content: "Test Task",
  };

  const defaultProps = {
    task: mockTask,
    index: 0,
    columnId: "column-1",
    isBeingEditedByOther: false,
    isBeingMovedByOther: false,
    isEditing: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();

    // Default configuration for useDrag
    (useDrag as jest.Mock).mockReturnValue([
      { isDragging: false },
      jest.fn((el) => el),
    ]);

    // Default configuration for useDrop
    (useDrop as jest.Mock).mockReturnValue([{}, jest.fn((el) => el)]);
  });

  test("should initialize with correct values and handle drag states", () => {
    const { result } = renderHook(() => useTaskDragDrop(defaultProps));

    // Verify initial values
    expect(result.current.ref).toBeDefined();
    expect(result.current.isDragging).toBe(false);

    // Verify useDrag configuration
    expect(useDrag).toHaveBeenCalledWith(
      expect.objectContaining({
        type: "TASK",
        canDrag: true,
      })
    );
  });

  test("should not allow dragging when task is locked", () => {
    renderHook(() =>
      useTaskDragDrop({
        ...defaultProps,
        isEditing: true,
      })
    );

    const dragConfig = (useDrag as jest.Mock).mock.calls[0][0];
    expect(dragConfig.canDrag).toBe(false);
  });

  test("should handle task movement", () => {
    // Simulate dragging start
    (useDrag as jest.Mock).mockReturnValue([
      { isDragging: true },
      jest.fn((el) => el),
    ]);

    const { rerender } = renderHook(() => useTaskDragDrop(defaultProps));

    // Verify that startMovingTask was called
    expect(startMovingTask).toHaveBeenCalledWith(mockTask.id);

    // Simulate dragging end
    (useDrag as jest.Mock).mockReturnValue([
      { isDragging: false },
      jest.fn((el) => el),
    ]);

    // Rerender to simulate end of dragging
    rerender();

    // Verify that stopMovingTask was called
    expect(stopMovingTask).toHaveBeenCalledWith(mockTask.id);
  });
});
