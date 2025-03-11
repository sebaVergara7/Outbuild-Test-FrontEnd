import { renderHook } from "@testing-library/react";
import { TaskStatusProps, useTaskStatus } from "@/hooks/useTaskStatus";

describe("useTaskStatus Hook", () => {
  test("should indicate task is being edited by another user", () => {
    const props: TaskStatusProps = {
      isBeingEditedByOther: true,
      isBeingMovedByOther: false,
    };

    const { result } = renderHook(() => useTaskStatus(props));

    expect(result.current).toEqual({
      showTaskStatus: true,
      showTaskStatusText: "Being edited by another user",
    });
  });

  test("should indicate task is being moved by another user", () => {
    const props: TaskStatusProps = {
      isBeingEditedByOther: false,
      isBeingMovedByOther: true,
    };

    const { result } = renderHook(() => useTaskStatus(props));

    expect(result.current).toEqual({
      showTaskStatus: true,
      showTaskStatusText: "Being moved by another user",
    });
  });

  test("should not show status when task is not being edited or moved", () => {
    const props: TaskStatusProps = {
      isBeingEditedByOther: false,
      isBeingMovedByOther: false,
    };

    const { result } = renderHook(() => useTaskStatus(props));

    expect(result.current).toEqual({
      showTaskStatus: false,
      showTaskStatusText: "",
    });
  });
});
