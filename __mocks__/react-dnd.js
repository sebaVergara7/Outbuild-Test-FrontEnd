import React from "react";

export const DndProvider = ({ children }) => <div>{children}</div>;
export const useDrag = jest
  .fn()
  .mockReturnValue([{ isDragging: false }, jest.fn()]);
export const useDrop = jest
  .fn()
  .mockReturnValue([{ isOver: false }, jest.fn()]);
