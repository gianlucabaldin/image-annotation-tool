import React, { useEffect, useRef, useState } from "react";

const DrawingCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [drawing, setDrawing] = useState(false);
  const [startX, setStartX] = useState<number | null>(null);
  const [startY, setStartY] = useState<number | null>(null);
  const [endX, setEndX] = useState<number | null>(null);
  const [endY, setEndY] = useState<number | null>(null);
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

  const handleMouseDown = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (!drawing && context) {
      setDrawing(true);
      const rect = e.currentTarget.getBoundingClientRect();
      console.log("🚀 ~ handleMouseDown:", rect);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setStartX(x);
      setStartY(y);
    }
  };

  const handleMouseUp = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    if (drawing && context) {
      const rect = e.currentTarget.getBoundingClientRect();
      console.log("🚀 ~ handleMouseUp:", rect);
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      setEndX(x);
      setEndY(y);
      drawRectangle();
      setDrawing(false);
    }
  };

  const resetCoordinates = () => {
    setStartX(null);
    setStartY(null);
    setEndX(null);
    setEndY(null);
  };

  const drawRectangle = () => {
    if (
      context &&
      startX !== null &&
      startY !== null &&
      endX !== null &&
      endY !== null
    ) {
      const width = endX - startX;
      const height = endY - startY;
      context.strokeStyle = "black";
      context.strokeRect(startX, startY, width, height);
      resetCoordinates();
    }
  };

  return (
    <>
      <canvas
        ref={canvasRef}
        width={500}
        height={500}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        style={{ border: "1px solid black" }}
      />
      <p>drawing = {drawing.toString()}</p>
    </>
  );
};

const App: React.FC = () => {
  return (
    <div>
      <DrawingCanvas />
    </div>
  );
};

export default App;
