import React, { useEffect, useRef, useState } from "react";
import { drawRectangle } from "../utils/common";
import { ACTION_TYPES, IRectangle } from "../utils/types";

interface BoardProps {
  action: ACTION_TYPES | null;
}

const Board = ({ action }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [tempX, setTempX] = useState<number | null>(null);
  const [tempY, setTempY] = useState<number | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [rectangles, setRectangles] = useState<Array<IRectangle>>([]);
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
      const mouseX = e.clientX;
      const mouseY = e.clientY;
      if (!isDrawing) {
        setStartX(mouseX);
        setStartY(mouseY);
      } else {
        const width = mouseX - startX!;
        const height = mouseY - startY!;
        if (startX !== null && startY !== null) {
          const newRectangle = {
            startX: startX,
            startY: startY,
            endX: startX + width,
            endY: startY + height,
          };
          setRectangles([...rectangles, newRectangle]);
          resetCoordinates();
        }
      }
      setIsDrawing(!isDrawing);
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (isDrawing && startX !== null && startY !== null) {
      setTempX(e.clientX);
      setTempY(e.clientY);
    }
  };

  const resetCoordinates = () => {
    setStartX(null);
    setStartY(null);
    setTempX(null);
    setTempY(null);
  };

  useEffect(() => {
    if (
      context &&
      startX !== null &&
      startY !== null &&
      tempX !== null &&
      tempY !== null
    ) {
      // const width = tempX - startX;
      // const height = tempY - startY;
      // clears the canvas with all the temporary dashed lines while drawing
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      rectangles.forEach((rect) => {
        // recreates the rectangles while is drawing, between first and second click
        drawRectangle(rect, context, isDrawing ? "blue" : "red");
      });
      // draws the temporary rectangle
      drawRectangle(
        { startX, startY, endX: tempX, endY: tempY },
        context,
        undefined,
        true
      );
    }
  }, [tempX, tempY]);

  useEffect(() => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      rectangles.forEach((rect) => {
        context.strokeStyle = "blue";
        if (rect.startX && rect.startY && rect.endX && rect.endY) {
          context.strokeRect(
            rect.startX,
            rect.startY,
            rect.endX - rect.startX,
            rect.endY - rect.startY
          );
        }
      });
    }
  }, [rectangles]);

  return (
    <canvas
      ref={canvasRef}
      onClick={handleClick}
      onMouseMove={handleMouseMove}
      width={800}
      height={500}
      className="m-4 border border-gray-400"
    />
  );
};

export default Board;
