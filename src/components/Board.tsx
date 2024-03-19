import React, { useEffect, useRef, useState } from "react";
import { drawRectangle } from "../utils/common";
import { ACTION_TYPES, IRectangle } from "../utils/types";

interface BoardProps {
  action: ACTION_TYPES | null;
}

const Board = ({ action }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coordinates, setCoordinates] = useState<IRectangle | null>(null);
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
      const { clientX: mouseX, clientY: mouseY } = e;

      if (!isDrawing) {
        setCoordinates({ startX: mouseX, startY: mouseY });
      } else if (coordinates) {
        const { startX, startY } = coordinates;
        if (!!startX && !!startY) {
          const width = mouseX - startX;
          const height = mouseY - startY;
          const newRectangle = {
            startX,
            startY,
            endX: startX + width,
            endY: startY + height,
          };
          setRectangles([...rectangles, newRectangle]);
          setCoordinates(null); // Reset coordinates for next rectangle
        }
      }

      setIsDrawing(!isDrawing);
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (isDrawing && coordinates) {
      setCoordinates({ ...coordinates, endX: e.clientX, endY: e.clientY });
    }
  };

  useEffect(() => {
    if (context && coordinates) {
      const { startX, startY, endX, endY } = coordinates;
      if (
        startX !== null &&
        startY !== null &&
        endX !== null &&
        endY !== null
      ) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        rectangles.forEach((rect) => drawRectangle(rect, context, "blue"));
        // Draw temporary rectangle
        drawRectangle({ ...coordinates }, context, undefined, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]); // Update only when coordinates change

  useEffect(() => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      rectangles.forEach((rect) => drawRectangle(rect, context, "blue"));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [rectangles]); // Update only when rectangles change

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
