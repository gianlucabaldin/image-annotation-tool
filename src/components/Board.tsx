import React, { useEffect, useRef, useState } from "react";
import { drawTemporaryAnnotation, redrawAllAnnotations } from "../utils/draw";
import { ACTION_TYPES, IAnnotation, SHAPE_TYPES } from "../utils/types";
import Dialog from "./Dialog";

interface BoardProps {
  action?: ACTION_TYPES;
}

const Board = ({ action }: BoardProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [coordinates, setCoordinates] = useState<IAnnotation | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [annotations, setAnnotations] = useState<Array<IAnnotation>>([]);
  const [context, setContext] = useState<CanvasRenderingContext2D | null>(null);
  const [openDialog, setOpenDialog] = useState(false); // State for dialog

  const annotationType =
    action === ACTION_TYPES.DRAW_RECTANGLE
      ? SHAPE_TYPES.RECTANGLE
      : SHAPE_TYPES.CIRCLE;

  const MARGINS = 16;

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
    e.preventDefault();
    if (context && action) {
      const { clientX, clientY } = e;

      const mouseX = clientX - MARGINS;
      const mouseY = clientY - MARGINS;

      if (!isDrawing) {
        // First click, starts the drawing
        setCoordinates({ firstClickX: mouseX, firstClickY: mouseY });
      } else if (coordinates) {
        const { firstClickX, firstClickY } = coordinates;
        if (!!firstClickX && !!firstClickY) {
          // Second click, ends the drawing and opens dialog
          const width = mouseX - firstClickX;
          const height = mouseY - firstClickY;
          const newAnnotation: IAnnotation = {
            firstClickX,
            firstClickY,
            endX: firstClickX + width,
            endY: firstClickY + height,
            type: annotationType,
          };
          setAnnotations([...annotations, newAnnotation]);
          setCoordinates(null); // Reset coordinates for next annotation
          setOpenDialog(true);
        }
      }
      setIsDrawing(!isDrawing);
    }
  };

  const handleMouseMove = (
    e: React.MouseEvent<HTMLCanvasElement, MouseEvent>
  ) => {
    e.preventDefault();
    if (isDrawing && coordinates) {
      setCoordinates({
        ...coordinates,
        endX: e.clientX - MARGINS,
        endY: e.clientY - MARGINS,
      });
    }
  };

  const handleSaveAnnotation = (label: string | undefined) => {
    // Update the last annotation in the annotations array with the label
    if (label && label.length > 0) {
      const updatedAnnotations = [...annotations];
      updatedAnnotations[annotations.length - 1].label = label;
      setAnnotations(updatedAnnotations);
    } else {
      removeLastElement();
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
        drawTemporaryAnnotation(
          coordinates,
          context,
          annotationType,
          annotations
        );
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coordinates]);

  useEffect(() => {
    if (context) {
      redrawAllAnnotations(context, annotations);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [annotations]);

  const handleOnCloseDialog = () => {
    removeLastElement();
    setOpenDialog(false);
  };

  const removeLastElement = () => {
    const annotationsCopy = [...annotations];
    annotationsCopy.pop();
    setAnnotations(annotationsCopy);
  };

  // TO remove
  const [mouseX, setMouseX] = useState(0);
  const [mouseY, setMouseY] = useState(0);
  const handleMouseMove2 = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setMouseX(e.clientX);
    setMouseY(e.clientY);
  };
  const getCanvasCoordinates = () => {
    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      return {
        top: rect.top + window.scrollY,
        left: rect.left + window.scrollX,
        right: rect.right + window.scrollX,
        bottom: rect.bottom + window.scrollY,
        width: rect.width,
        height: rect.height,
      };
    }
    return null;
  };

  const canvasCoordinates = getCanvasCoordinates();

  return (
    <div className="flex flex-col" onMouseMove={handleMouseMove2}>
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        width={800}
        height={500}
        className={"m-4 border border-gray-400"}
      />
      {openDialog && (
        <Dialog onClose={handleOnCloseDialog} onSave={handleSaveAnnotation} />
      )}
      <p className="mb-4">
        Mouse position: ({mouseX}, {mouseY})
      </p>
      {canvasCoordinates && (
        <div className="flex justify-evenly mb-4">
          <div>Top: {canvasCoordinates.top}</div>
          <div>Left: {canvasCoordinates.left}</div>
          <div>Right: {canvasCoordinates.right}</div>
          <div>Bottom: {canvasCoordinates.bottom}</div>
          <div>Width: {canvasCoordinates.width}</div>
          <div>Height: {canvasCoordinates.height}</div>
        </div>
      )}
    </div>
  );
};

export default Board;
