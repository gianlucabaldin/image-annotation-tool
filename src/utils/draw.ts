import { IAnnotation, SHAPE_COLORS, SHAPE_TYPES } from "./types";

/**
 * Draws a annotation on the canvas based on the provided annotation data, using the given rendering context and annotation type.
 *
 * @param {IAnnotation} annotation - the annotation object containing the coordinates and other details of the annotation
 * @param {CanvasRenderingContext2D} ctx - the 2D rendering context for the canvas
 * @param {SHAPE_TYPES} [annotationType=SHAPE_TYPES.RECTANGLE] - the type of annotation to be drawn (default: rectangle)
 * @param {boolean} [dashed=false] - a boolean indicating if the annotation should be drawn as dashed lines (default: false)
 */
export const drawAnnotation = (
  annotation: IAnnotation,
  ctx: CanvasRenderingContext2D,
  annotationType: SHAPE_TYPES = SHAPE_TYPES.RECTANGLE,
  dashed: boolean = false
) => {
  const { firstClickX, firstClickY, endX, endY } = annotation;
  if (!firstClickX || !firstClickY || !endX || !endY) return;
  const width = endX - firstClickX;
  const height = endY - firstClickY;
  ctx.font = "14px Arial";
  if (dashed) {
    // dashed line when drawing (between first and second click)
    ctx.setLineDash([5, 5]);
  }
  if (annotationType === SHAPE_TYPES.RECTANGLE) {
    ctx.strokeStyle = SHAPE_COLORS.RECTANGLE;
    ctx.strokeRect(firstClickX, firstClickY, width, height);
    drawAnnotationLabel(annotation, ctx);
  } else {
    const centerX = (firstClickX + endX) / 2;
    const centerY = (firstClickY + endY) / 2;
    const radius = Math.sqrt(
      (firstClickX - centerX) ** 2 + (firstClickY - centerY) ** 2
    );
    ctx.strokeStyle = SHAPE_COLORS.CIRCLE;
    drawAnnotationLabel(annotation, ctx, centerX, centerY);
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, 2 * Math.PI);
    ctx.stroke();
  }
  // reset to non-dashed line
  ctx.setLineDash([]);
};

const drawAnnotationLabel = (
  annotation: IAnnotation,
  ctx: CanvasRenderingContext2D,
  centerX?: number,
  centerY?: number
) => {
  ctx.font = "14px Arial";
  if (annotation.type === SHAPE_TYPES.RECTANGLE) {
    ctx.fillStyle = SHAPE_COLORS.RECTANGLE;
    ctx.fillText(
      annotation.label ?? "",
      annotation.firstClickX ?? 0,
      annotation.firstClickY ?? 0 - 10
    );
  } else {
    ctx.fillStyle = SHAPE_COLORS.CIRCLE;
    // calculate text length
    const labelWidth = ctx.measureText(annotation.label ?? "").width;
    // draw text in the middle of the circle
    ctx.fillText(
      annotation.label ?? "",
      centerX ?? 0 - labelWidth / 2,
      centerY ?? 0 + 5
    );
  }
};

// Draw temporary dashed annotation on canvas while user is drawing
export const drawTemporaryAnnotation = (
  coordinates: IAnnotation,
  ctx: CanvasRenderingContext2D,
  annotationType: SHAPE_TYPES,
  annotations: IAnnotation[]
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  annotations.forEach((rect) => drawAnnotation(rect, ctx, rect.type));
  drawAnnotation({ ...coordinates }, ctx, annotationType, true);
};
export const redrawAllAnnotations = (
  ctx: CanvasRenderingContext2D,
  annotations: IAnnotation[]
) => {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  annotations.forEach((annotation) =>
    drawAnnotation(annotation, ctx, annotation.type)
  );
};
