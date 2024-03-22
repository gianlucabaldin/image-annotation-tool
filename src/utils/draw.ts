import { IAnnotation, SHAPE_COLORS, SHAPE_TYPES } from "./types";

export const drawAnnotation = (
  annotation: IAnnotation,
  ctx: CanvasRenderingContext2D,
  annotationType: SHAPE_TYPES = SHAPE_TYPES.RECTANGLE,
  dashed: boolean = false,
  color?: SHAPE_COLORS
) => {
  const { firstClickX, firstClickY, seconcClickX, seconcClickY } = annotation;
  if (!firstClickX || !firstClickY || !seconcClickX || !seconcClickY) return;
  const dimensions = getAnnotationWidthAndHeight(annotation);
  ctx.font = "14px Arial";
  if (dashed) {
    // dashed line when drawing (between first and second click)
    ctx.setLineDash([5, 5]);
  }
  if (annotationType === SHAPE_TYPES.RECTANGLE) {
    ctx.strokeStyle = color ?? SHAPE_COLORS.RECTANGLE;
    if (!dimensions) return;
    const { width, height } = dimensions;
    ctx.strokeRect(firstClickX, firstClickY, width, height);
    drawAnnotationLabel(annotation, ctx);
  } else {
    const radius = Math.sqrt(
      (firstClickX - seconcClickX) ** 2 + (firstClickY - seconcClickY) ** 2
    );
    const center = getAnnotationCenterPoint(annotation);
    if (!center) return;
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
  centerX?: number, // for circles
  centerY?: number // for circles
) => {
  ctx.font = "bolder 20px Arial";
  // calculate text length
  const labelWidth = ctx.measureText(annotation.label ?? "").width;
  const dimensions = getAnnotationWidthAndHeight(annotation);
  if (
    annotation.type === SHAPE_TYPES.RECTANGLE &&
    annotation.firstClickX &&
    annotation.firstClickY
  ) {
    const { firstClickX, firstClickY } = annotation;
    ctx.fillStyle = SHAPE_COLORS.RECTANGLE;
    // draw centered text in the middle of the rectangle, a bit below the upper line
    ctx.fillText(
      annotation.label ?? "",
      firstClickX + (dimensions?.width ?? 0) / 2 - labelWidth / 2,
      firstClickY + 30
    );
  } else {
    ctx.fillStyle = SHAPE_COLORS.CIRCLE;
    // draw centered text in the middle of the circle, just a bit up
    // in order not to overlap with the hand used to select
    ctx.fillText(
      annotation.label ?? "",
      (centerX ?? 0) - labelWidth / 2,
      (centerY ?? 0) - 30
    );
  }
};

// Draw ONE temporary dashed annotation on canvas while user is drawing
// meaning the user has clicked once and it is moving on the canvas
// before clicking the second time
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

// if user is in SELECT mode and hovers an annotation, highlight
// the annotation in yellow and put a hand image in the middle to select it
export const highlightAnnotation = (
  mouseClickX: number,
  mouseClickY: number,
  context: CanvasRenderingContext2D,
  annotations: IAnnotation[]
) => {
  annotations.forEach((annotation) => {
    let isHovered = false;
    if (annotation.type === SHAPE_TYPES.RECTANGLE) {
      isHovered = isPointInRectangle(mouseClickX, mouseClickY, annotation);
      drawAnnotation(
        annotation,
        context,
        annotation.type,
        false,
        isHovered ? SHAPE_COLORS.HOVERED : SHAPE_COLORS.RECTANGLE
      );
    } else if (annotation.type === SHAPE_TYPES.CIRCLE) {
      const radius = Math.sqrt(
        (annotation.firstClickX! - annotation.seconcClickX!) ** 2 +
          (annotation.firstClickY! - annotation.seconcClickY!) ** 2
      );
      isHovered = isPointInsideCircle(
        mouseClickX,
        mouseClickY,
        annotation.firstClickX ?? 0,
        annotation.firstClickY ?? 0,
        radius
      );
      drawAnnotation(
        annotation,
        context,
        annotation.type,
        false,
        isHovered ? SHAPE_COLORS.HOVERED : SHAPE_COLORS.CIRCLE
      );
    }

    // if the mouse matches an annotation, draw a hand in the middle
    if (isHovered) {
      drawHand(context, annotation);
    } else {
      // clear previous hand, if any
      const coordinates = getAnnotationCenterPoint(annotation);
      if (coordinates) {
        // consider the 32px icon offset
        context.clearRect(coordinates.x - 16, coordinates.y - 16, 32, 32);
      }
    }
  });
};

// check if the mouse is inside the circle
export function isPointInsideCircle(
  pointX: number,
  pointY: number,
  centerX: number,
  centerY: number,
  radius: number
): boolean {
  // Calcolate ditance between the mouse pointer and the center of the circle
  const distance = Math.sqrt((pointX - centerX) ** 2 + (pointY - centerY) ** 2);
  return distance <= radius;
}

// check if the mouse is inside the rectangle
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

// draw a hand in the middle of the annotation
export const drawHand = function (
  ctx: CanvasRenderingContext2D,
  annotation: IAnnotation
) {
  const { firstClickX, firstClickY, seconcClickX, seconcClickY } = annotation;
  if (!firstClickX || !firstClickY || !seconcClickX || !seconcClickY) {
    return;
  }
  const handImage = new Image();
  handImage.src = "/hand.ico";
  handImage.onload = function () {
    const center = getAnnotationCenterPoint(annotation);
    // since the hand image is 32x32, we need to offset the middle point (R) or the center point (C)
    // by hald of the image (16px)
    if (center) {
      ctx.drawImage(handImage, center.x - 16, center.y - 16);
    }
  };
};

const getAnnotationWidthAndHeight = (annotation: IAnnotation) => {
  const { firstClickX, firstClickY, seconcClickX, seconcClickY } = annotation;
  if (!firstClickX || !firstClickY || !seconcClickX || !seconcClickY) return;
  return {
    width: Math.abs(firstClickX - seconcClickX),
    height: Math.abs(firstClickY - seconcClickY),
  };
};

export const getAnnotationCenterPoint = (annotation: IAnnotation) => {
  const { firstClickX, firstClickY, seconcClickX, seconcClickY } = annotation;
  if (!firstClickX || !firstClickY || !seconcClickX || !seconcClickY) {
    return;
  }
  const x =
    annotation.type === SHAPE_TYPES.CIRCLE
      ? firstClickX
      : (firstClickX + seconcClickX) / 2;
  const y =
    annotation.type === SHAPE_TYPES.CIRCLE
      ? firstClickY
      : (firstClickY + seconcClickY) / 2;
  return { x, y };
};
