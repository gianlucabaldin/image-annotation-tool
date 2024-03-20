import React, { useEffect, useRef, useState } from "react";
import { drawShape } from "../utils/common";
import { ACTION_TYPES, IShape, SHAPE_TYPES } from "../utils/types";
import Dialog from "./Dialog";

interface BoardProps {
  action?: ACTION_TYPES;
}

const Board = ({ action }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coordinates, setCoordinates] = useState<IShape | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [shapes, setShapes] = useState<Array<IShape>>([]);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog

  const shapeType =
    action === ACTION_TYPES.DRAW_RECTANGLE
      ? SHAPE_TYPES.RECTANGLE
      : SHAPE_TYPES.CIRCLE;

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
        // First click, starts the drawing
        setCoordinates({ firstClickX: mouseX, firstClickY: mouseY });
      } else if (coordinates) {
        const { firstClickX, firstClickY } = coordinates;
        if (!!firstClickX && !!firstClickY) {
          // Second click, ends the drawing and opens dialog
          const width = mouseX - firstClickX;
          const height = mouseY - firstClickY;
          const newShape: IShape = {
            firstClickX,
            firstClickY,
            endX: firstClickX + width,
            endY: firstClickY + height,
            type: shapeType,
          };
          setShapes([...shapes, newShape]);
          setCoordinates(null); // Reset coordinates for next shape
          setOpenDialog(true);
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

  const handleSaveShape = (label: string | undefined) => {
    // Update the last shape in the shapes array with the label
    if (label && shapes.length > 0) {
      const updatedShapes = [...shapes];
      updatedShapes[shapes.length - 1].label = label;
      setShapes(updatedShapes);
    }
    setOpenDialog(false);
  };

  useEffect(() => {
    if (context && coordinates) {
      const { firstClickX, firstClickY, endX, endY } = coordinates;
      if (
        firstClickX !== null &&
        firstClickY !== null &&
        endX !== null &&
        endY !== null
      ) {
        context.clearRect(0, 0, context.canvas.width, context.canvas.height);
        shapes.forEach((rect) => drawShape(rect, context, rect.type));
        // Draw temporary shapes
        drawShape({ ...coordinates }, context, shapeType, true);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  useEffect(() => {
    if (context) {
      context.clearRect(0, 0, context.canvas.width, context.canvas.height);
      shapes.forEach((shape) => drawShape(shape, context, shape.type));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [shapes]);

  return (
    <div className="flex flex-col">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        width={800}
        height={500}
        className="m-4 border border-gray-400"
      />
      {openDialog && (
        <Dialog
          onClose={() => {
            setOpenDialog(false);
          }}
          onSave={handleSaveShape}
        />
      )}
      {shapes.length &&
        shapes.map((s, i) => <p key={i}>{JSON.stringify(s, undefined, 2)}</p>)}
    </div>
  );
};

export default Board;
