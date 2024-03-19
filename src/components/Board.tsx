import React, { useEffect, useRef, useState } from "react";
import { ACTION_TYPES } from "../utils/types";

interface BoardProps {
  action: ACTION_TYPES | null;
}
const Board = ({ action }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
      }
    }
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    if (context && action) {
      setIsDrawing(true);
      if (startX === null && startY === null) {
        setStartX(e.clientX);
        setStartY(e.clientY);
        setIsDrawing(true);
      } else {
        draw(e.clientX, e.clientY, action);
      }
    }
  };

  const resetCoordinates = () => {
    setStartX(null);
    setStartY(null);
  };

  const draw = (x: number, y: number, action: ACTION_TYPES) => {
    if (context && startX !== null && startY !== null) {
      const width = x - startX;
      const height = y - startY;
      context.strokeStyle = "red";
      if (action === ACTION_TYPES.DRAW_RECTANGLE) {
        context.strokeRect(startX, startY, width, height);
      } else if (action === ACTION_TYPES.DRAW_CIRCLE) {
        context.beginPath();
        context.arc(startX, startY, Math.abs(width / 2), 0, 2 * Math.PI);
        context.stroke();
      }
      resetCoordinates();
      setIsDrawing(false);
    }
  };

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      width={800}
      height={500}
      className="m-4 border border-gray-400"
    />
  );
};

export default Board;
