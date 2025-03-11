import { renderHook } from "@testing-library/react";
import { UserActivityProps, useUserActivity } from "@/hooks/useUserActivity";

// Mocks
const mockBoardContext = {
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
};

jest.mock("@/contexts/BoardContext", () => ({
  useBoard: () => mockBoardContext,
}));

describe("useUserActivity Hook", () => {
  test("should show that a user is editing a task", () => {
    const props: UserActivityProps = { userId: "user-1" };

    const { result } = renderHook(() => useUserActivity(props));

    expect(result.current).toEqual("Editing: Task 1...");
  });

  test("should show that a user is moving a task", () => {
    const props: UserActivityProps = { userId: "user-2" };

    const { result } = renderHook(() => useUserActivity(props));

    expect(result.current).toEqual("Moving: Task 2...");
  });

  test("should show user as online when not editing or moving", () => {
    const props: UserActivityProps = { userId: "user-3" };

    const { result } = renderHook(() => useUserActivity(props));

    expect(result.current).toEqual("Online");
  });
});
