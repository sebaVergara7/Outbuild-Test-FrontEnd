import React from "react";
import { render, act } from "@testing-library/react";
import {
  BoardContextType,
  BoardProvider,
  useBoard,
} from "@/contexts/BoardContext";
import { useSocket } from "@/hooks/useSocket";

// Mock useSocket
jest.mock("@/hooks/useSocket", () => ({
  useSocket: jest.fn(() => ({
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
  })),
}));

// Test component to access the context
const TestComponent: React.FC<{
  onBoardState?: (state: BoardContextType) => void;
}> = ({ onBoardState }) => {
  const boardState = useBoard();
  React.useEffect(() => {
    if (onBoardState) onBoardState(boardState);
  }, [boardState, onBoardState]);
  return null;
};

describe("BoardContext", () => {
  beforeEach(() => {
    // Mock localStorage
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: jest.fn(() => "test-user-id"),
        setItem: jest.fn(),
      },
      writable: true,
    });
  });

  test("provides initial board state", () => {
    const onBoardState = jest.fn();

    render(
      <BoardProvider>
        <TestComponent onBoardState={onBoardState} />
      </BoardProvider>
    );

    // Verify that the initial state is correct
    expect(onBoardState).toHaveBeenCalledWith(
      expect.objectContaining({
        columns: expect.objectContaining({
          "to-do": expect.objectContaining({
            id: "to-do",
            title: "To Do",
            taskIds: [],
          }),
          "in-progress": expect.objectContaining({
            id: "in-progress",
            title: "In Progress",
            taskIds: [],
          }),
          done: expect.objectContaining({
            id: "done",
            title: "Done",
            taskIds: [],
          }),
        }),
        tasks: {},
        connectedUsers: [],
      })
    );
  });

  test("creates a task correctly", () => {
    const onBoardState = jest.fn();
    const mockEmit = jest.fn();
    (useSocket as jest.Mock).mockReturnValue({
      on: jest.fn(),
      emit: mockEmit,
      off: jest.fn(),
    });

    let boardState: BoardContextType;

    render(
      <BoardProvider>
        <TestComponent
          onBoardState={(state) => {
            boardState = state;
            onBoardState(state);
          }}
        />
      </BoardProvider>
    );

    // Call createTask
    act(() => {
      boardState.createTask("to-do", "New task content");
    });

    // Get the last call to onBoardState
    const lastCall =
      onBoardState.mock.calls[onBoardState.mock.calls.length - 1][0];

    // Verify that the task was created
    const taskId = Object.keys(lastCall.tasks)[0];
    expect(lastCall.tasks[taskId].content).toBe("New task content");
    expect(lastCall.columns["to-do"].taskIds).toContain(taskId);

    // Verify that the event was emitted
    expect(mockEmit).toHaveBeenCalledWith(
      "board-update",
      expect.objectContaining({
        tasks: lastCall.tasks,
        columns: lastCall.columns,
      })
    );
  });

  test("updates a task correctly", () => {
    const onBoardState = jest.fn();
    const mockEmit = jest.fn();
    (useSocket as jest.Mock).mockReturnValue({
      on: jest.fn(),
      emit: mockEmit,
      off: jest.fn(),
    });

    let boardState: BoardContextType;
    let taskId: string = "";

    render(
      <BoardProvider>
        <TestComponent
          onBoardState={(state) => {
            boardState = state;
            onBoardState(state);
          }}
        />
      </BoardProvider>
    );

    // Create a task first
    act(() => {
      taskId = boardState.createTask("to-do", "Original content");
    });

    // Update the task
    act(() => {
      boardState.updateTask(taskId, "Updated content");
    });

    // Get the last call to onBoardState
    const lastCall =
      onBoardState.mock.calls[onBoardState.mock.calls.length - 1][0];

    // Verify that the task was updated
    expect(lastCall.tasks[taskId].content).toBe("Updated content");

    // Verify that the event was emitted
    expect(mockEmit).toHaveBeenCalledWith(
      "board-update",
      expect.objectContaining({
        tasks: lastCall.tasks,
      })
    );
  });

  test("deletes a task correctly", () => {
    const onBoardState = jest.fn();
    const mockEmit = jest.fn();
    (useSocket as jest.Mock).mockReturnValue({
      on: jest.fn(),
      emit: mockEmit,
      off: jest.fn(),
    });

    let boardState: BoardContextType;
    let taskId: string = "";

    render(
      <BoardProvider>
        <TestComponent
          onBoardState={(state) => {
            boardState = state;
            onBoardState(state);
          }}
        />
      </BoardProvider>
    );

    // Create a task first
    act(() => {
      taskId = boardState.createTask("to-do", "Test content");
    });

    // Delete the task
    act(() => {
      boardState.deleteTask(taskId);
    });

    // Get the last call to onBoardState
    const lastCall =
      onBoardState.mock.calls[onBoardState.mock.calls.length - 1][0];

    // Verify that the task was deleted
    expect(lastCall.tasks[taskId]).toBeUndefined();
    expect(lastCall.columns["to-do"].taskIds).not.toContain(taskId);

    // Verify that the event was emitted
    expect(mockEmit).toHaveBeenCalledWith(
      "board-update",
      expect.objectContaining({
        tasks: lastCall.tasks,
        columns: lastCall.columns,
      })
    );
  });

  test("moves a task correctly", () => {
    const onBoardState = jest.fn();
    const mockEmit = jest.fn();
    (useSocket as jest.Mock).mockReturnValue({
      on: jest.fn(),
      emit: mockEmit,
      off: jest.fn(),
    });

    let boardState: BoardContextType;
    let taskId: string = "";

    render(
      <BoardProvider>
        <TestComponent
          onBoardState={(state) => {
            boardState = state;
            onBoardState(state);
          }}
        />
      </BoardProvider>
    );

    // Create a task first
    act(() => {
      taskId = boardState.createTask("to-do", "Test content");
    });

    // Move the task to another column
    act(() => {
      boardState.moveTask(taskId, "to-do", "in-progress", 0);
    });

    // Get the last call to onBoardState
    const lastCall =
      onBoardState.mock.calls[onBoardState.mock.calls.length - 1][0];

    // Verify that the task was moved
    expect(lastCall.columns["to-do"].taskIds).not.toContain(taskId);
    expect(lastCall.columns["in-progress"].taskIds).toContain(taskId);

    // Verify that the event was emitted
    expect(mockEmit).toHaveBeenCalledWith(
      "board-update",
      expect.objectContaining({
        columns: lastCall.columns,
      })
    );
  });
});
