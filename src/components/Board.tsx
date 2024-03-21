import React, { useEffect, useRef, useState } from "react";
import { MARGINS } from "../utils/const";
import {
  drawAnnotation,
  drawTemporaryAnnotation,
  isPointInRectangle,
  isPointInsideCircle,
  redrawAllAnnotations,
} from "../utils/draw";
import {
  ACTION_TYPES,
  IAnnotation,
  SHAPE_COLORS,
  SHAPE_TYPES,
} from "../utils/types";
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
      if (action === ACTION_TYPES.SELECT) {
        console.log("action is not select");
        return;
      }
      const { clientX, clientY } = e;
      const mouseX = clientX;
      const mouseY = clientY;
      if (!isDrawing) {
        // First click, starts the drawing
        setCoordinates({ firstClickX: mouseX, firstClickY: mouseY });
      } else if (coordinates) {
        const { firstClickX, firstClickY } = coordinates;
        if (!!firstClickX && !!firstClickY) {
          // Second click, ends the drawing and opens dialog
          // const width = mouseX - firstClickX;
          // const height = mouseY - firstClickY;
          const newAnnotation: IAnnotation = {
            firstClickX,
            firstClickY,
            seconcClickX: mouseX,
            seconcClickY: mouseY,
            // seconcClickX: firstClickX + width,
            // seconcClickY: firstClickY + height,
            type: annotationType,
            id: Date.now().toString(),
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
        seconcClickX: e.clientX,
        seconcClickY: e.clientY,
      });
    } else if (action === ACTION_TYPES.SELECT && context) {
      const { clientX: mouseClickX, clientY: mouseClickY } = e;

      annotations.forEach((annotation) => {
        if (annotation.type === SHAPE_TYPES.RECTANGLE) {
          if (isPointInRectangle(mouseClickX, mouseClickY, annotation)) {
            console.log("isPointInRectangle = " + annotation.label);
            drawAnnotation(
              annotation,
              context,
              annotation.type,
              false,
              SHAPE_COLORS.HOVERED
            );
          }
        } else if (annotation.type === SHAPE_TYPES.CIRCLE) {
          const radius = Math.sqrt(
            (annotation.firstClickX! - annotation.seconcClickX! + MARGINS) **
              2 +
              (annotation.firstClickY! - annotation.seconcClickY! + MARGINS) **
                2
          );
          if (
            isPointInsideCircle(
              mouseClickX,
              mouseClickY,
              annotation.firstClickX ?? 0,
              annotation.firstClickY ?? 0,
              radius
            )
          ) {
            drawAnnotation(
              annotation,
              context,
              annotation.type,
              false,
              SHAPE_COLORS.HOVERED
            );
          }
        }
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
      const {
        firstClickX,
        firstClickY,
        seconcClickX: endX,
        seconcClickY: endY,
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
      annotations: <br />
      {annotations.length &&
        annotations.map((s, i) => (
          <p key={i}>{JSON.stringify(s, undefined, 2)}</p>
        ))}
      <hr />
      hovered:
      {/* <br /> {hovered && <p>{JSON.stringify(hovered, undefined, 2)}</p>} */}
      <hr />
    </div>
  );
};

export default Board;
