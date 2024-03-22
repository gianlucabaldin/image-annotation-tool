import React, { useEffect, useRef, useState } from "react";
import {
  drawTemporaryAnnotation,
  highlightAnnotation,
  redrawAllAnnotations,
} from "../utils/draw";
import { ACTION_TYPES, IAnnotation, SHAPE_TYPES } from "../utils/types";
import Dialog from "./Dialog";

interface BoardProps {
  action?: ACTION_TYPES;
  storedAnnotations?: Array<IAnnotation>;
  saveSession: (annotations: IAnnotation[]) => void;
}

const Board = ({ action, storedAnnotations = [], saveSession }: BoardProps) => {
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

  useEffect(() => {
    if (canvasRef.current) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (ctx) {
        setContext(ctx);
        ctx.lineWidth = 3;
        if (storedAnnotations.length > 0) {
          setAnnotations(storedAnnotations);
        }
      }
    }
  }, [canvasRef, storedAnnotations]);

  const handleClick = (e: React.MouseEvent<HTMLCanvasElement, MouseEvent>) => {
    e.preventDefault();
    if (context && action) {
      if (action === ACTION_TYPES.SELECT) {
        return;
      }
      const {
        nativeEvent: { offsetX, offsetY },
      } = e;
      const mouseX = offsetX;
      const mouseY = offsetY;
      if (!isDrawing) {
        // First click, starts the drawing
        setCoordinates({ firstClickX: mouseX, firstClickY: mouseY });
      } else if (coordinates) {
        const { firstClickX, firstClickY } = coordinates;
        if (!!firstClickX && !!firstClickY) {
          // Second click, ends the drawing and opens dialog
          const newAnnotation: IAnnotation = {
            firstClickX,
            firstClickY,
            secondClickX: mouseX,
            secondClickY: mouseY,
            type: annotationType,
            id: Date.now().toString(), // just a random id
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
        secondClickX: e.nativeEvent.offsetX,
        secondClickY: e.nativeEvent.offsetY,
      });
    } else if (action === ACTION_TYPES.SELECT && context) {
      const { offsetX: mouseClickX, offsetY: mouseClickY } = e.nativeEvent;
      // if hover an annotation, highlight it in yellow
      // if aready over one and mouse points outside of the annotation
      // remove the highlight color and restore its original one
      highlightAnnotation(mouseClickX, mouseClickY, context, annotations);
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
      const {
        firstClickX,
        firstClickY,
        secondClickX: endX,
        secondClickY: endY,
      } = coordinates;
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

  return (
    <div className="flex flex-col">
      <canvas
        ref={canvasRef}
        onClick={handleClick}
        onMouseMove={handleMouseMove}
        width={800}
        height={500}
        className={"m-8 border border-gray-400 bg-cover bg-center "}
        style={{
          backgroundImage: `url(/bg.jpg)`,
        }}
      />
      {openDialog && (
        <Dialog onClose={handleOnCloseDialog} onSave={handleSaveAnnotation} />
      )}

      <button
        className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded my-auto w-48 mx-8"
        onClick={() => saveSession(annotations)}
      >
        SAVE SESSION
      </button>
    </div>
  );
};

export default Board;
