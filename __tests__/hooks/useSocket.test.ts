import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useSocket } from "@/hooks/useSocket";
import io, { Socket } from "socket.io-client";
import { DefaultEventsMap } from "socket.io";

// Mock
jest.mock("socket.io-client");

describe("useSocket Hook", () => {
  const mockSocket = {
    id: "socket-id",
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
    disconnect: jest.fn(),
  };

  beforeEach(() => {
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  test("should establish socket connection on initial render", async () => {
    await act(async () => {
      renderHook(() => useSocket());
    });

    expect(io).toHaveBeenCalledWith("http://localhost:3001");
    expect(io).toHaveBeenCalledTimes(1);
  });

  test("should return the socket instance with expected methods", async () => {
    let result: {
      current: Socket<DefaultEventsMap, DefaultEventsMap> | null;
    } = { current: null };

    await act(async () => {
      const rendered = renderHook(() => useSocket());
      result = rendered.result;
    });

    // Verify that the returned socket contains the expected methods
    expect(result.current).toHaveProperty("id", "socket-id");
    expect(result.current).toHaveProperty("on");
    expect(result.current).toHaveProperty("emit");
    expect(result.current).toHaveProperty("off");
  });

  test("should reuse the same socket instance across multiple renders", async () => {
    let hookResult: any;

    await act(async () => {
      hookResult = renderHook(() => useSocket());
    });

    // First render
    expect(io).toHaveBeenCalledTimes(1);

    // Re-render the hook
    await act(async () => {
      hookResult.rerender();
    });

    // Verify that a new connection was not created
    expect(io).toHaveBeenCalledTimes(1);
  });
});
