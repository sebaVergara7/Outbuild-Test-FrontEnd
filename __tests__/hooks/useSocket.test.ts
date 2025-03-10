import { renderHook } from "@testing-library/react";
import { act } from "react";
import { useSocket } from "@/hooks/useSocket";
import io from "socket.io-client";

jest.mock("socket.io-client");

describe("useSocket Hook", () => {
  const mockSocket = {
    id: "socket-id",
    on: jest.fn(),
    emit: jest.fn(),
    off: jest.fn(),
  };

  beforeEach(() => {
    (io as jest.Mock).mockReturnValue(mockSocket);
  });

  test("should create socket connection on first render", async () => {
    await act(async () => {
      renderHook(() => useSocket());
    });

    expect(io).toHaveBeenCalledWith("http://localhost:3001");
  });

  test("should return the socket instance", async () => {
    const { result } = renderHook(() => useSocket());

    expect(result.current).toEqual(expect.objectContaining(mockSocket));
  });

  test("should create the socket only once across multiple renders", async () => {
    const { rerender } = renderHook(() => useSocket());
    rerender();

    expect(io).toHaveBeenCalledTimes(1);
  });
});
