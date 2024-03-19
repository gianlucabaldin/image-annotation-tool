import React, { useEffect, useRef, useState } from "react";

const Board: React.FC = () => {
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
    if (context) {
      setIsDrawing(true);
      if (startX === null && startY === null) {
        setStartX(e.clientX);
        setStartY(e.clientY);
        setIsDrawing(true);
      } else {
        drawRectangle(e.clientX, e.clientY);
      }
    }
  };

  const resetCoordinates = () => {
    setStartX(null);
    setStartY(null);
  };

  const drawRectangle = (x: number, y: number) => {
    if (context && startX !== null && startY !== null) {
      const width = x - startX;
      const height = y - startY;
      context.strokeStyle = "red";
      context.strokeRect(startX, startY, width, height);
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
