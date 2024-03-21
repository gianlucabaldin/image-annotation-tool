import { MARGINS } from "./const";
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
  dashed: boolean = false,
  color?: SHAPE_COLORS
) => {
  const { firstClickX, firstClickY, seconcClickX, seconcClickY } = annotation;
  if (!firstClickX || !firstClickY || !seconcClickX || !seconcClickY) return;
  const width =
    firstClickX > seconcClickX
      ? firstClickX - seconcClickX
      : seconcClickX - firstClickX;
  const height =
    firstClickY > seconcClickY
      ? firstClickY - seconcClickY
      : seconcClickY - firstClickY;
  ctx.font = "14px Arial";
  if (dashed) {
    // dashed line when drawing (between first and second click)
    ctx.setLineDash([5, 5]);
  }
  if (annotationType === SHAPE_TYPES.RECTANGLE) {
    ctx.strokeStyle = color ?? SHAPE_COLORS.RECTANGLE;
    ctx.strokeRect(firstClickX - MARGINS, firstClickY - MARGINS, width, height);
    drawAnnotationLabel(annotation, ctx);
  } else {
    const radius = Math.sqrt(
      (firstClickX - seconcClickX + MARGINS) ** 2 +
        (firstClickY - seconcClickY + MARGINS) ** 2
    );
    ctx.strokeStyle = color ?? SHAPE_COLORS.CIRCLE;
    drawAnnotationLabel(annotation, ctx, firstClickX, firstClickY);
    ctx.beginPath();
    ctx.arc(firstClickX, firstClickY, radius, 0, 2 * Math.PI);
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

export function isPointInsideCircle(
  pointX: number,
  pointY: number,
  centerX: number,
  centerY: number,
  radius: number
): boolean {
  // Calcola la distanza tra il punto e il centro del cerchio
  const distance = Math.sqrt((pointX - centerX) ** 2 + (pointY - centerY) ** 2);

  // Restituisce true se la distanza è minore o uguale al raggio, false altrimenti
  return distance <= radius;
}

export const isPointInRectangle = (
  mouseX: number,
  mouseY: number,
  annotation: IAnnotation
) => {
  const { firstClickX, firstClickY, seconcClickX, seconcClickY } = annotation;
  if (!firstClickX || !firstClickY || !seconcClickX || !seconcClickY)
    return false;
  return (
    mouseX >= Math.min(firstClickX, seconcClickX) &&
    mouseX <= Math.max(firstClickX, seconcClickX) &&
    mouseY >= Math.min(firstClickY, seconcClickY) &&
    mouseY <= Math.max(firstClickY, seconcClickY)
  );
};
