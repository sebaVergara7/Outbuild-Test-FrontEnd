import React from "react";
import { render, screen } from "@testing-library/react";
import { DndProvider } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";
import Board from "@/components/Board/Board";
import { BoardProvider } from "@/contexts/BoardContext";

jest.mock("react-dnd");
jest.mock("react-dnd-html5-backend");

jest.mock("@/contexts/BoardContext", () => ({
  ...jest.requireActual("@/contexts/BoardContext"),
  useBoard: () => ({
    connectedUsers: [
      { userId: "user-1", username: "User 1" },
      { userId: "user-2", username: "User 2" },
    ],
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
    columns: {
      "column-1": { id: "column-1", title: "Column 1", taskIds: [] },
      "column-2": { id: "column-2", title: "Column 2", taskIds: [] },
    },
  }),
}));

const renderBoardWithDnd = () => {
  return render(
    <DndProvider backend={HTML5Backend}>
      <BoardProvider>
        <Board />
      </BoardProvider>
    </DndProvider>
  );
};

describe("Board Component", () => {
  test("renders board title correctly", () => {
    renderBoardWithDnd();
    expect(screen.getByText("Collaborative Task Board")).toBeInTheDocument();
  });

  test("renders the correct number of columns", () => {
    renderBoardWithDnd();
    expect(screen.getByText("Column 1")).toBeInTheDocument();
    expect(screen.getByText("Column 2")).toBeInTheDocument();
  });
});
